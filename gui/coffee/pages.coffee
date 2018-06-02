window.Pages = {}
pages = [
  'pageMessages',
  'pageAbout',
  'pageUserPage',
  'pageFriends',
  'pageCreateUser',
  'pagePeople',
  'pageNodes'
]
for page in pages
  document.write '<script src="js/' + page + '.js"></script>'