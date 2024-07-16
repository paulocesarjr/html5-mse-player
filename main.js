import MSEVideoPlayer from "./mse_video_player"

const mimeCodec = 'video/mp4; codecs="avc1.4D401F"'
const videoSegments = [
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000.dash",
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-0.dash",
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-25600.dash",
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-51200.dash"
]

document.addEventListener("DOMContentLoaded", () => {
  const player = new MSEVideoPlayer("videoElement", mimeCodec, videoSegments)
  player.init()
})
