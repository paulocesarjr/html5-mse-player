const mimeCodec = 'video/mp4; codecs="avc1.4D401F"'
const videoChunks = [
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000.dash",
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-0.dash",
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-25600.dash",
  "https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-51200.dash"
]

document.addEventListener("DOMContentLoaded", function () {
  // 1º Check that browser has support for media codec
  const isSypportedType = MediaSource.isTypeSupported(mimeCodec)

  if (isSypportedType) {
    // 2º Create Media Source
    const mediaSource = new MediaSource()

    // 3º Get video element
    const video = document.getElementById("videoElement")

    // 4º Attach media source to video element
    video.src = URL.createObjectURL(mediaSource)

    // 5º Wait for media source to be open
    mediaSource.addEventListener("sourceopen", onSourceOpen)
  } else {
    console.error("Video type not supported")
  }
})

function onSourceOpen() {
  const mediaSource = this // mediaSource.readyState === 'open'
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

  let currentSegmentIndex = 0

  sourceBuffer.addEventListener("updateend", () => {
    if (!sourceBuffer.updating && currentSegmentIndex < videoChunks.length) {
      fetchVideoSegment(videoChunks[currentSegmentIndex], sourceBuffer)
      currentSegmentIndex++
    } else if (currentSegmentIndex >= videoChunks.length) {
      mediaSource.endOfStream()
    }
  })

  sourceBuffer.addEventListener("error", (e) => {
    console.error("SourceBuffer error:", e)
  })

  fetchVideoSegment(videoChunks[currentSegmentIndex], sourceBuffer)
  currentSegmentIndex++
}

function fetchVideoSegment(url, sourceBuffer) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((data) => {
      if (!sourceBuffer.updating) {
        sourceBuffer.appendBuffer(data)
      }
    })
    .catch((error) => console.error("Error fetching video segment:", error))
}
