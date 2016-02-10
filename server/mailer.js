/*
 * Uses the settings file to create default emails.  Thus if we don't have at least the MAIL 
 * key set up this module is unusable and the site won't really work.
 */

if(!Meteor.settings.MAIL)
    throw new Error("You must have a Meteor.settings.MAIL attribute, please refer to the settings.json.sample file.");

Mailer = {
    sendTemplatedEmail: function(templateKey, overrides, context) {
        //Setting up default variables available in the template, so you don't have to pass them in every time.
        context = _.extend({}, {
          settings: Meteor.settings
        }, context || {});
        
        //You can override the templateSettings.template variable to render a different template in a different package.
        templateSettings = Meteor.settings.MAIL.templates[templateKey];
        //This compiles templates as needed, and allows them to be overridden by child packages if they compile
        //the template early enough in the lifecycle.
        if(!Template[templateSettings.template]) {
          //By default look up templates in the /private/email_templates folder
          SSR.compileTemplate(templateKey, Assets.getText('email_templates/' + templateSettings.template + '.html'));
        }
                
        /* The settings for an email trickle down from most to least important:
         * 1. Overrides passed in
         * 2. Individual template settings
         * 3. Default template settings
         * 4. Settings in this file (like text)
         */
               
        template = _.extend(
            {
              text: SSR.render(templateKey, context)
            }, 
            Meteor.settings.MAIL.templates.default, 
            templateSettings,
            overrides
        );
        
        //Apply string formatting to every string variable in the template, this allows you to have a variable subject for example.
        template = _.object(_.map(template, function(value, key) {
          var finalValue = value;
          if(typeof value === "string") {
            finalValue = value.format(context);
          }
          
          return [ key, finalValue ];
        }));
        
        try {
            Email.send(template);
        }catch(e) {
            //May not be the best error message, I'm not sure if including the error string could expose any sensitive information.
            throw new Meteor.Error(500, 'There was a problem sending an email using the ' + templateKey + ' template.  ' + e.toString());
        }
    }
}