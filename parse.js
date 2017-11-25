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
        let voteLink = post.getElementsByClassName('votelinks')[0].getElementsByTagName('a')[0];
        let storylink = post.getElementsByClassName('storylink')[0]
        let score = info.getElementsByClassName('score')[0];
        let user = info.getElementsByClassName('hnuser')[0];
        let age = info.getElementsByClassName('age')[0].firstElementChild;
        let infoLinks = info.getElementsByTagName('a');
        let hide = infoLinks[infoLinks.length-2];
        let comments = infoLinks[infoLinks.length-1];
        data.push({
            title: post.getElementsByClassName('title')[0].textContent,
            story: {
                text: storylink.textContent,
                href: storylink.href,
                site: {
                    text: post.getElementsByClassName('sitestr')[0].textContent,
                    href: post.getElementsByClassName('sitestr')[0].parentElement.getAttribute('href'),
                }
            },
            vote: {
                id: voteLink.id,
                href: voteLink.href,
            },
            score: {
                id: info.getElementsByClassName('score')[0].id,
                points: parseInt(info.getElementsByClassName('score')[0].textContent.replace(/\D+/g, ''))
            },
            user: {
                name: user.textContent,
                href: user.href,
            },
            age: {
                timeago: age.textContent,
                href: age.getAttribute('href')
            },
            hideLink: hide.href,
            comments: {
                number: parseInt(comments.textContent.replace(/\D+/g, '')),
                href: comments.href
            }
        });
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
    title.innerText = post.title;
    element.appendChild(title);

    let score = document.createElement('div');
    score.className = 'score';
    let vote = document.createElement('a');
    vote.className = 'upvote';
    vote.href = post.vote.href;
    score.appendChild(vote);
    let points = document.createElement('span');
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

let postData = getPosts(document.body);
let headLinks = document.head.getElementsByTagName('link');
for (let i = 0; i < headLinks.length; ++i) {
    if (headLinks[i].getAttribute('rel') == 'stylesheet') {
        document.head.removeChild(headLinks[i]);
        break;
    }
}
document.body.innerHTML = '';
for (let i = 0; i < postData.length; ++i) {
    console.log(postData[i]);
    document.body.appendChild(buildPostHTML(postData[i]));
}