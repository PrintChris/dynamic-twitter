let users = [
  {
    userName: "elonmusk",
    displayName: "Elon Musk",
    joinedDate: "June 2009",
    followingCount: 103,
    followerCount: 47900000,
    verified: false,
    avatarURL: "https://i.ibb.co/cDRcH0K/elonmusk.jpg",
    coverPhotoURL: "https://i.ibb.co/vH4Y7Jc/elonmusk-cover.jpg",
    tweets: [
      {
        text: "Starship to the moon",
        timestamp: "2/09/2021 18:37:12",
      },
      {
        text: "I admit to judging books by their cover",
        timestamp: "1/10/2021 00:01:20",
      },
      {
        text: "Out on launch pad, engine swap underway",
        timestamp: "2/06/2021 12:11:51",
      },
      {
        text: `I'm about to launch another rocket :-)`,
        timestamp: "3/09/2023 16:13:02",
      },
    ],
  },

  {
    userName: "BillGates",
    displayName: "Bill Gates",
    joinedDate: "June 2010",
    followingCount: 274,
    followerCount: 53800000,
    verified: true,
    avatarURL: "https://i.ibb.co/8s0pQ8c/billgates.jpg",
    coverPhotoURL: "https://i.ibb.co/DMdkQvz/billgates-cover.jpg",
    tweets: [
      {
        text: "Everybody asks, how is the next Windows coming along? But nobody asks how is Bill?",
        timestamp: "12/31/2022 16:01:20",
      },
      {
        text: "Should I start tweeting memes? Let me know in a comment.",
        timestamp: "1/1/2023 18:37:12",
      },
      {
        text: "In 2020, I read a book every hour.",
        timestamp: "4/30/2023 10:15:00",
      },
    ],
  },
];

// create object with the number of tweets.
const tweetCounter = users.map((user) => ({
  userName: user.userName,
  tweetCount: user.tweets.length,
}));

// define global variable(s)
let tweetsForDisplay = [];

// user selection

const appendToDropdownUserSelector = (element) => {
  const containerOfSelectElement = document.querySelector(element);

  const selectContainer = document.createElement("select");
  selectContainer.setAttribute("id", "user-selector");

  const defaultOption = document.createElement("option");
  defaultOption.innerText = "--select user--";
  selectContainer.appendChild(defaultOption);

  users.forEach((user) => {
    const optionContainer = document.createElement("option");

    optionContainer.value = user.userName;
    optionContainer.innerText = user.displayName;

    selectContainer.appendChild(optionContainer);
  });

  containerOfSelectElement.appendChild(selectContainer);
  // console.log(containerOfSelectElement);
};

const appendSearchStringToURL = () => {
  const selectUserId = document.querySelector("#user-selector");
  selectUserId.addEventListener("change", (event) => {
    window.location.href =
      window.location.origin + "?user=" + event.target.value;
  });
};

const urlSearchString = window.location.search;
const searchParams = new URLSearchParams(urlSearchString);

let activeUserName = searchParams.get("user");
appendToDropdownUserSelector("#header-right-section");
appendSearchStringToURL();

generateTweetsForDisplay();

if (activeUserName === null) {
  if (window.location.pathname === "/timeline.html") {
    tweetsDisplay();
  } else {
    // show landing page if no user selected (null)
    const bodySelector = document.querySelector("body");

    bodySelector.innerHTML = `
        <div id="landing-container">
            <h1>Twitter</h1>
            <h3>Select a user ...</h3>
            <div id="user-selector-container"></div>
        </div>
        <footer>
            <a href="timeline.html" class="footer-link">Timeline</a>
        </footer>

        `;
    appendToDropdownUserSelector("#user-selector-container");
    appendSearchStringToURL();
  }
} else {
  // user selected -> display individual user's twitter page

  activeUserName = searchParams.get("user");
  console.log("Active user: " + activeUserName);

  let indexUser = users.map((user) => user.userName).indexOf(activeUserName);
  let userSelector = users[indexUser];

  // Update Title
  const pageTitle = document.querySelector('title');
  pageTitle.innerText = userSelector.displayName + " - Dynamic Twitter"

  // Display name & verification tick
  let displayNameVar = userSelector.displayName;

  let verifiedTick = "";
  if (userSelector.verified) {
    verifiedTick = ` <img src='https://i.ibb.co/bWycpzf/verified.png'>`;
  }

  const displayNameClass = document.querySelectorAll(".display-name");

  displayNameClass.forEach((name) => {
    name.innerHTML = displayNameVar + verifiedTick;
  });

  // User name
  const userNameClass = document.querySelectorAll(".user-name");

  userNameClass.forEach((name) => {
    name.innerHTML = "@" + activeUserName;
  });

  // User selector
  const headerUserSelector = document.querySelector("#user-selector");

  // number of tweets in header
  const tweeCountId = document.querySelector("#tweet-count");
  let indexCounter;

  for (let i = 0; i < tweetCounter.length; i++) {
    if (tweetCounter[i].userName === activeUserName) {
      indexCounter = i;
      break;
    }
  }

  let numberOfTweets = tweetCounter[indexCounter].tweetCount;
  let tweetUnit;

  if (numberOfTweets === 1) {
    tweetUnit = " Tweet";
  } else {
    tweetUnit = " Tweets";
  }

  tweeCountId.textContent = numberOfTweets + tweetUnit;

  // banner image
  const coverPhotoSelector = userSelector.coverPhotoURL;
  const coverPhoto = document.querySelector("#cover");
  coverPhoto.innerHTML = `<img src=${coverPhotoSelector} width=100%>`;

  // avatar
  let avatarSelector = userSelector.avatarURL;
  const avatarPhoto = document.querySelector("#avatar");
  avatarPhoto.innerHTML = `<img id="avatar-img" src=${avatarSelector} width="145px">`;

  // (un)follow
  const followButton = document.querySelector("#follow-button");
  let following = false;
  followButton.addEventListener("click", function () {
    if (!following) {
      followButton.textContent = "Following";
      following = true;
    } else {
      followButton.textContent = "Follow";
      following = false;
    }
  });

  // join date
  const joinDateSelector = userSelector.joinedDate;
  const joinDate = document.querySelector("#join-date");
  joinDate.innerHTML = `<i class="fa-solid fa-calendar-days"></i> Joined <time>${joinDateSelector}</time>`;

  // Compact number formatting -> convert > 1,000 to K and > 1,000,000 to M
  compactFollowCount = (number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(number);
  };

  // Following
  const followingCountSelector = compactFollowCount(
    userSelector.followingCount
  );
  const followingCountId = document.querySelector("#following-count");
  followingCountId.textContent = followingCountSelector;

  // Followers
  const followerCountSelector = compactFollowCount(userSelector.followerCount);
  const followerCountId = document.querySelector("#follower-count");
  followerCountId.textContent = followerCountSelector;

  // Tweets, Replies, Media, Likes tab selector & display
  function setNewActive(el) {
    // tab selector formatting (underline)
    const tabSelectorTexts = document.querySelectorAll(".tab-text");
    tabSelectorTexts.forEach((tabSelectorText) => {
      tabSelectorText.classList.remove("tab-text-active");
    });

    document
      .getElementById(el.replace("tab", "tab-text"))
      .classList.add("tab-text-active");

    // tab content body
    const contentBodies = document.querySelectorAll(".content-body");
    contentBodies.forEach((contentBody) => {
      contentBody.classList.remove("content-active");
    });

    document
      .getElementById(el.replace("tab", "body"))
      .classList.add("content-active");
  }

  // add event listener to all tabs
  const tabSelector = document.querySelectorAll(".tab");

  tabSelector.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      setNewActive(e.currentTarget.id);
      console.log(e.currentTarget.id);
    });
  });

  // TWEETS

  // generateTweetsForDisplay()
  // verification that original tweet objects have not been updated.
  // users.forEach(user => console.log(user.tweets));

  // let tweetSelector = userSelector.tweets; // users[1].tweets

  filterTweetsForDisplay(activeUserName);
  tweetsDisplay();
}

function generateTweetsForDisplay() {
  /*
    How could this be simplified? [solution: see live code below]
    The goal is to add the username to the tweets object.
    Each tweet object is then added to an new array.

    Also, the current solution is modifying the original objects.
    This is currently not a problem but may not be very efficient.
    
    
    let tweetsForDisplay = [];

    for (let i = 0; i < users.length; i++) {
        let parentIndex = i;
        let parentUserName = users[i].userName;

        for (let i = 0; i < users[parentIndex].tweets.length; i++) {
            
            let currentTweet = users[parentIndex].tweets[i]
            currentTweet.userName = parentUserName;
            tweetsForDisplay.push(currentTweet);     
        };
    };

    */

  /*
    // Simpler but still updating original tweets.

    let tweetsForDisplay = [];

    users.forEach(user => {
        let parentUserName = user.userName;
        let tweets = user.tweets.map(tweet => {
            tweet.userName = parentUserName;
            return tweet;
        });
        tweetsForDisplay.push(...tweets);
    });
    */

  tweetsForDisplay = users.flatMap((user) =>
    user.tweets.map((tweet) => ({
      ...tweet,
      userName: user.userName,
      displayName: user.displayName,
      avatarURL: user.avatarURL,
      verified: user.verified,
    }))
  );

  // add verification tick to each tweet if applicable

  tweetsForDisplay.forEach((tweet) => {
    if (tweet.verified) {
      tweet.verifiedTick = ` <img src='https://i.ibb.co/bWycpzf/verified.png'>`;
    } else {
      tweet.verifiedTick = "";
    }
  });

  console.log("tweetsForDisplay: ", tweetsForDisplay);

  tweetSelector = tweetsForDisplay;
}

function filterTweetsForDisplay(user) {
  return (tweetSelector = tweetsForDisplay.filter(
    (property) => property.userName === user
  ));
}

function tweetsDisplay() {
  const tweetsBodySelector = document.getElementById("tweets-body");

  sortTweets(tweetSelector);

  tweetSelector.forEach((tweet) => {
    const tweetContainer = document.createElement("div");
    tweetContainer.classList.add("tweet-container");
    tweetsBodySelector.appendChild(tweetContainer);
    let timePosted = formatTweetDate(new Date(tweet.timestamp));

    tweetContainer.innerHTML = `
            <div class="tweet-avatar">
            <img id="tweet-avatar-img" src=${tweet.avatarURL} width="48px">
            </div>
            
            <div class="tweet-header">
                <div class="tweet-header-left">
                    <div class="display-name tweet-display-name">${tweet.displayName} 
                        <span id="tweet-verified-tick">${tweet.verifiedTick}</span>
                    </div>
            
                    <div class="user-name tweet-user-name">
                        @${tweet.userName}
                    </div>
            
                    <div class="time-posted">
                        · ${timePosted}
                    </div>
                </div>
            
                <div class="tweet-header-right">
                    <button type="button" class="round-button"><i class="fa-solid fa-ellipsis"></i></button>
                </div>
            </div>

            <div class="tweet-text">
                ${tweet.text}
            </div>
                
            <div class="tweet-footer">
                <button type="button" class="round-button tweet-footer-button"><i class="fa-regular fa-comment"></i></button>
                <button type="button" class="round-button tweet-footer-button"><i class="fa-solid fa-retweet"></i></button>
                <button type="button" class="round-button tweet-footer-button"><i class="fa-regular fa-heart"></i></button>
                <button type="button" class="round-button tweet-footer-button"><i class="fa-solid fa-signal"></i></button>
                <button type="button" class="round-button tweet-footer-button"><i class="fa-solid fa-arrow-up-from-bracket"></i></button>
            </div>
        `;
  });
}

// time and date format for tweet time
function formatTweetDate(date) {
  const timeSincePosted = new Date() - date;
  const timeSincePostedInHours = Math.trunc(timeSincePosted / 36e5);
  const inLast24Hours = timeSincePostedInHours < 24;
  const currentDate = new Date();
  const yearPosted = date.getFullYear();
  const isThisYear = currentDate.getFullYear() === yearPosted;
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthPosted = month[date.getMonth()];
  const datePosted = date.getDate();

  if (inLast24Hours) {
    return timeSincePostedInHours + "h";
  } else if (isThisYear) {
    return monthPosted + " " + datePosted;
  } else {
    return monthPosted + " " + datePosted + ", " + yearPosted;
  }
}

//sort tweets by timestamp
function sortTweets(tweets) {
  tweets.sort((a, b) => {
    let dateA = new Date(a.timestamp);
    let dateB = new Date(b.timestamp);
    return dateB - dateA;
  });
}
