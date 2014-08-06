if (Posts.find().count() === 0) {

  Posts.insert({
    title: 'Test Post',
    author: 'Test User',
    url: 'http://www.test.com'
  });

}