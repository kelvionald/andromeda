var i, len, page, pages;

window.Pages = {};

pages = ['pageMessages', 'pageAbout', 'pageUserPage', 'pageFriends', 'pageCreateUser', 'pagePeople', 'pageNodes'];

for (i = 0, len = pages.length; i < len; i++) {
  page = pages[i];
  document.write('<script src="js/' + page + '.js"></script>');
}
