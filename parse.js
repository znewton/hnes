/**
 * 
 * @param {HTMLElement} page 
 * @return {array} data
 */
function getPosts(page) {
    let itemList = page.getElementsByClassName('itemlist')[0];
    let posts = itemList.getElementsByClassName('athing');
    let data = [];
    for (let p = 0; p < posts.length; ++p) {
        let post = posts.item(p);
        let info = post.nextElementSibling;
        let title = post.getElementsByClassName('title')[0];
        let voteLink = post.getElementsByClassName('votelinks')[0];
        if (voteLink) voteLink = voteLink.getElementsByTagName('a')[0];
        let storylink = post.getElementsByClassName('storylink')[0];
        let sitestr = post.getElementsByClassName('sitestr')[0];
        let score = info.getElementsByClassName('score')[0];
        let user = info.getElementsByClassName('hnuser')[0];
        let age = info.getElementsByClassName('age')[0];
        if (age) age = age.firstElementChild;
        let infoLinks = info.getElementsByTagName('a');
        let hide = infoLinks[infoLinks.length-2];
        let comments = infoLinks[infoLinks.length-1];
        let thisPost = {
            title: title ? title.textContent : '',
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
                href: voteLink ? voteLink.href : voteLink,
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
            comments: {
                number: comments ? parseInt(comments.textContent.replace(/\D+/g, '')) : null,
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
    score.href = post.vote.href;
    let vote = document.createElement('div');
    vote.className = 'upvote';
    score.appendChild(vote);
    let points = document.createElement('div');
    points.className = 'points';
    points.innerText = post.score.points;
    score.appendChild(points);
    element.appendChild(score);
    
    let story = document.createElement('div');
    story.className = 'story';
    let storyLink = document.createElement('a');
    storyLink.innerText = post.story.text;
    storyLink.href = post.story.href;
    story.appendChild(storyLink);
    let info = document.createElement('div');
    info.className = 'info';
    let timeago = document.createElement('a');
    timeago.className = 'timeago';
    timeago.innerText = post.age.timeago;
    timeago.href = post.age.href;
    info.appendChild(timeago);
    info.appendChild(document.createTextNode(' by '));
    let user = document.createElement('a');
    user.className = 'user';
    user.href = post.user.href;
    user.innerText = post.user.name;
    info.appendChild(user);
    info.appendChild(document.createTextNode(' | '));
    let comments = document.createElement('a');
    comments.innerText = post.comments.number + ' comments';
    comments.href = post.comments.href;
    info.appendChild(comments);
    story.appendChild(info);
    element.appendChild(story);

    let storySite = document.createElement('div');
    storySite.className = 'story-site';
    let storySiteLink = document.createElement('a');
    storySiteLink.innerText = '(' + post.story.site.text + ')';
    storySiteLink.href = post.story.site.href;
    storySite.appendChild(storySiteLink);
    element.appendChild(storySite);

    return element;
}

function rebuildNavbar() {
    let nav = document.createElement('nav');
    return nav;
}

function rebuildMain() {
    let postData = getPosts(document.body);
    let postList = document.createElement('main');
    postList.className = 'post-list';
    for (let i = 0; i < postData.length; ++i) {
        console.log(postData[i]);
        postList.appendChild(buildPostHTML(postData[i]));
    }
    return postList;
}

function rebuildFooter() {
    let footer = document.createElement('footer');
    return footer;
}

let nav = rebuildNavbar();
let main = rebuildMain();
let footer = rebuildFooter();
let headLinks = document.head.getElementsByTagName('link');
for (let i = 0; i < headLinks.length; ++i) {
    if (headLinks[i].getAttribute('rel') == 'stylesheet') {
        document.head.removeChild(headLinks[i]);
        break;
    }
}
document.body.innerHTML = '';
document.body.appendChild(nav);
document.body.appendChild(main);
document.body.appendChild(footer);