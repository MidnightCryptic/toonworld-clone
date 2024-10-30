// Simulating a local storage for videos and comments
let videos = JSON.parse(localStorage.getItem('videos')) || [];
let comments = JSON.parse(localStorage.getItem('comments')) || {};

function displayVideos() {
    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';

    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.innerHTML = `<h3>${video.title}</h3>
                               <a href="video.html?id=${video.id}">Watch</a>`;
        videoList.appendChild(videoItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('video-list')) {
        displayVideos();
    }

    if (document.getElementById('upload-form')) {
        document.getElementById('upload-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const videoFile = document.getElementById('video-file').files[0];
            const videoTitle = document.getElementById('video-title').value;

            if (videoFile && videoTitle) {
                const videoId = Date.now();
                const videoURL = URL.createObjectURL(videoFile); // Create a blob URL
                videos.push({ id: videoId, title: videoTitle, file: videoURL });
                localStorage.setItem('videos', JSON.stringify(videos));
                document.getElementById('upload-message').innerText = 'Video uploaded successfully!';
                document.getElementById('upload-form').reset();
                displayVideos();
            } else {
                document.getElementById('upload-message').innerText = 'Please select a video file and provide a title.';
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    if (videoId) {
        const video = videos.find(v => v.id == videoId);
        if (video) {
            document.getElementById('video-title').innerText = video.title;
            document.getElementById('video-source').src = video.file; // Set the video source
            document.getElementById('video-player').load(); // Load the video

            // Display comments
            if (comments[videoId]) {
                comments[videoId].forEach(comment => {
                    const commentItem = document.createElement('div');
                    commentItem.innerText = comment;
                    document.getElementById('comments-list').appendChild(commentItem);
                });
            }

            document.getElementById('comment-submit').addEventListener('click', () => {
                const commentInput = document.getElementById('comment-input');
                const commentText = commentInput.value;
                if (commentText) {
                    if (!comments[videoId]) {
                        comments[videoId] = [];
                    }
                    comments[videoId].push(commentText);
                    localStorage.setItem('comments', JSON.stringify(comments));
                    const commentItem = document.createElement('div');
                    commentItem.innerText = commentText;
                    document.getElementById('comments-list').appendChild(commentItem);
                    commentInput.value = '';
                }
            });
        } else {
            document.getElementById('video-title').innerText = 'Video not found.';
        }
    }
});
