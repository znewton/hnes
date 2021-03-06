/**
 * 
 * @param {HTMLElement} page 
 * @return {array} data
 */
function getPosts(page) {
    let itemList = page.getElementsByClassName('itemlist')[0];
    if (!itemList) return null;
    let posts = itemList.getElementsByClassName('athing');
    let data = [];
    for (let p = 0; p < posts.length; ++p) {
        let post = posts.item(p);
        let info = post.nextElementSibling;
        let title = post.getElementsByClassName('title')[0];
        let voteLink = post.getElementsByClassName('votelinks')[0];
        let unvoteLink = document.getElementById('un_' + post.id);
        if (voteLink) voteLink = unvoteLink ? null : voteLink.getElementsByTagName('a')[0];
        let storylink = post.getElementsByClassName('storylink')[0];
        let sitestr = post.getElementsByClassName('sitestr')[0];
        let score = info.getElementsByClassName('score')[0];
        let user = info.getElementsByClassName('hnuser')[0];
        let age = info.getElementsByClassName('age')[0];
        if (age) age = age.firstElementChild;
        let infoLinks = info.getElementsByTagName('a');
        let hide = infoLinks[2];
        let past = info.getElementsByClassName('hnpast')[0];
        let web = infoLinks[infoLinks.length - 2] && infoLinks[infoLinks.length - 2].textContent == 'web' ? infoLinks[infoLinks.length - 2].getAttribute('href') : '';
        let comments = infoLinks[infoLinks.length-1];
        let thisPost = {
            title: title ? title.textContent : '',
            id: post.id,
            story: {
                text: storylink ? storylink.textContent : '',
                href: storylink ? storylink.href : '',
                site: {
                    text: sitestr ? sitestr.textContent : '',
                    href: sitestr ? sitestr.parentElement.getAttribute('href') : '',
                }
            },
            vote: {
                id: voteLink ? voteLink.id : voteLink,
                href: voteLink ? voteLink.href : (unvoteLink ? unvoteLink.href : ''),
                unvote: unvoteLink
            },
            score: {
                id: score ? score.id : score,
                points: score ? parseInt(score.textContent.replace(/\D+/g, '')) : null
            },
            user: {
                name: user ? user.textContent : '',
                href: user ? user.href : '',
            },
            age: {
                timeago: age ? age.textContent : '',
                href: age ? age.getAttribute('href') : ''
            },
            hideLink: hide ? hide.href : '',
            pastLink: past ? past.getAttribute('href') : '',
            webLink: web,
            comments: {
                number: comments && comments.textContent != 'discuss' ? parseInt(comments.textContent.replace(/\D+/g, '')) : -1,
                href: comments ? comments.href : ''
            }
        };
        data.push(thisPost);
    }
    return data;
}


/**
 * 
 * @param {*} post 
 */
function buildPostHTML(post) {
    let element = document.createElement('div');
    element.className = 'post';

    let title = document.createElement('div');
    title.className = 'title';
    title.innerText = post.title.substr(0,post.title.length - 1);
    element.appendChild(title);

    let score = document.createElement('a');
    score.className = 'score';
    score.id = 'score'+post.id;
    if (post.vote.href) {
        score.href = post.vote.href;
        let vote = document.createElement('div');
        vote.className = 'upvote' + (post.vote.unvote ? ' upvoted' : '');
        score.appendChild(vote);
        let points = document.createElement('div');
        points.className = 'points';
        points.innerText = post.score.points;
        score.onclick = (e) => {
            e.preventDefault();
            new Image().src = post.vote.href;
            let scoreElement = document.getElementById('score' + post.id);
            if (vote.classList.contains('upvoted')) {
                vote.classList.remove('upvoted');
                scoreElement.href = scoreElement.href.replace('how=un','how=up')
            } else {
                vote.classList.add('upvoted');
                scoreElement.href = scoreElement.href.replace('how=up','how=un')
            }
            e.stopPropagation();
        }
        score.appendChild(points);
    }
    element.appendChild(score);
    
    let story = document.createElement('div');
    story.className = 'story';
    let storyLink = document.createElement('a');
    storyLink.innerText = post.story.text;
    storyLink.title = post.story.text;
    storyLink.href = post.story.href;
    story.appendChild(storyLink);
    let info = document.createElement('div');
    info.className = 'info';
    let timeago = document.createElement('a');
    timeago.className = 'timeago';
    timeago.innerText = post.age.timeago;
    timeago.href = post.age.href;
    info.appendChild(timeago);
    if (post.user.name) {
        info.appendChild(document.createTextNode(' by '));
        let user = document.createElement('a');
        user.className = 'user';
        user.href = post.user.href;
        user.innerText = post.user.name;
        info.appendChild(user);
    }
    info.appendChild(document.createTextNode(' | '));
    let comments = document.createElement('a');
    comments.innerText = post.comments.number >= 0 ? (post.comments.number + ' comments') : 'discuss';
    comments.href = post.comments.href;
    info.appendChild(comments);
    story.appendChild(info);
    element.appendChild(story);

    let storySite = document.createElement('div');
    storySite.className = 'story-site';
    if (post.story.site.text) {
        let storySiteLink = document.createElement('a');
        storySiteLink.innerText = '(' + post.story.site.text + ')';
        storySiteLink.href = post.story.site.href;
        storySite.appendChild(storySiteLink);
    }
    element.appendChild(storySite);

    return element;
}

function rebuildNavbar() {
    let nav = document.createElement('nav');

    let user = document.getElementById('me');
    let navinfo = {};
    let headerlinks = [
        {
            text: 'new',
            href: 'newest',
        }, 
        {
            text: 'best',
            href: 'best',
        }, 
        {
            text: 'comments',
            href: 'newcomments'
        },
        {
            text: 'show',
            href: 'show'
        },
        {
            text: 'ask',
            href: 'ask'
        },
        {
            text: 'jobs',
            href: 'jobs'
        },
        {
            text: 'submit',
            href: 'submit'
        }
    ]
    if (user) {
        navinfo.username = user.textContent;
        navinfo.userUrl = user.getAttribute('href');
        let logout = document.getElementById('logout');
        navinfo.logoutUrl = logout.getAttribute('href');
        let userSection = user.parentElement;
        user.innerText = '';
        logout.innerText = '';
        let karma = parseInt(userSection.textContent.replace(/\D+/g,''));
        navinfo.karma = karma;
        navinfo.threadsUrl = document.getElementsByClassName('pagetop')[0].getElementsByTagName('a')[1].getAttribute('href');
        headerlinks.splice(2,0,{
            text: 'threads',
            href: navinfo.threadsUrl
        });
    } else {
        navinfo.loginUrl = document.getElementsByClassName('pagetop')[1].getElementsByTagName('a')[0].getAttribute('href');
    }
    let left = document.createElement('div');
    left.className = 'left';
    let logo = document.createElement('a');
    logo.href = 'https://news.ycombinator.com';
    logo.innerText = 'Y';
    logo.id = 'logo';
    left.appendChild(logo);
    let hnname = document.createElement('a');
    hnname.className = 'hnname';
    hnname.href = 'news';
    hnname.innerText = 'Hacker News';
    left.appendChild(hnname);
    for (let i = 0; i < headerlinks.length; ++i) {
        let link = document.createElement('a');
        link.className = 'nav-link';
        link.href = headerlinks[i].href;
        link.innerText = headerlinks[i].text;
        left.appendChild(link);
    }
    nav.appendChild(left);

    let right = document.createElement('div');
    right.className = 'right';
    if (navinfo.logoutUrl) {
        let userLink = document.createElement('a');
        userLink.href = navinfo.userUrl;
        userLink.innerText = navinfo.username + ' (' + (navinfo.karma > 0 ? '+' : '') + navinfo.karma + ')';
        userLink.className = 'username nav-link';
        right.appendChild(userLink);
        let logout = document.createElement('a');
        logout.id = 'logout';
        logout.className = 'nav-link';
        logout.href = navinfo.logoutUrl;
        logout.innerText = 'logout';
        right.appendChild(logout);
    } else {
        let login = document.createElement('a');
        login.id = 'login';
        login.className = 'nav-link';
        login.href = navinfo.loginUrl;
        login.innerText = 'login';
        right.appendChild(login);
    }
    nav.appendChild(right);

    return nav;
}

function rebuildMain() {
    let postData = getPosts(document.body);
    if (!postData) return null;
    let postList = document.createElement('main');
    postList.className = 'post-list';
    for (let i = 0; i < postData.length; ++i) {
        postList.appendChild(buildPostHTML(postData[i]));
    }
    let morelink = document.getElementsByClassName('morelink')[0];
    let moreUrl = morelink ? morelink.getAttribute('href') : '';
    let moreBlock = document.createElement('div');
    moreBlock.className = 'more-block';
    morelink.parentElement.removeChild(morelink);
    moreBlock.appendChild(morelink);
    postList.appendChild(moreBlock);
    return postList;
}

function rebuildFooter() {
    let footer = document.createElement('footer');
    if (!document.getElementsByClassName('yclinks')[0]) return null;
    let currentFooterLinks = document.getElementsByClassName('yclinks')[0].getElementsByTagName('a');
    let footerLinks = [];
    for (let i = 0; i < currentFooterLinks.length; ++i) {
        footerLinks.push({
            text: currentFooterLinks[i].textContent,
            href: currentFooterLinks[i].getAttribute('href')
        });
    }
    let footerLinksBlock = document.createElement('div');
    footerLinksBlock.className = 'footer-links';
    for (let i = 0; i < footerLinks.length; ++i) {
        let link = document.createElement('a');
        link.className = 'footer-link';
        link.href = footerLinks[i].href;
        link.innerText = footerLinks[i].text;
        footerLinksBlock.appendChild(link);
    }
    footer.appendChild(footerLinksBlock);
    let searchForm = document.createElement('form');
    searchForm.method = 'get';
    searchForm.action = '//hn.algolia.com/';
    let searchLabel = document.createElement('label');
    searchLabel.for = 'footer-search';
    searchLabel.appendChild(document.createTextNode('Search: '))
    let searchInput = document.createElement('input');
    searchInput.id = 'footer-search';
    searchInput.name = 'q';
    searchInput.autocomplete = false;
    searchInput.spellcheck = false;
    searchInput.type = 'text';
    searchLabel.appendChild(searchInput);
    searchForm.appendChild(searchLabel);
    footer.appendChild(searchForm);
    return footer;
}

let nav = rebuildNavbar();
let main = rebuildMain();
let footer = rebuildFooter();
// check that is is main page, figure out styling of subpages later
if (nav && main && footer) {
    let headLinks = document.head.getElementsByTagName('link');
    for (let i = 0; i < headLinks.length; ++i) {
        if (headLinks[i].getAttribute('rel') == 'stylesheet') {
            document.head.removeChild(headLinks[i]);
            break;
        }
    }
    if (nav && main && footer) document.body.innerHTML = '';
    if (nav) document.body.appendChild(nav);
    if (main) document.body.appendChild(main);
    if (footer) document.body.appendChild(footer);
}