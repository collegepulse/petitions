/** Site-wide, global information, including denormalized data.
 *
 *  Structure: 
 *
 *    {
 *      postsCount:            <integer>, // Petition count
 *      minimumThreshold:      <integer>, // Current minimum threshold
 *      threshold_updated_at:  <integer>  // Last datetime threshold changed
 *    }
 */

Singleton = new Meteor.Collection('singleton');
