export default class MSEVideoPlayer {
  constructor(videoElementId, mimeCodec, videoSegments) {
    this.videoElement = document.getElementById(videoElementId)
    this.mimeCodec = mimeCodec
    this.videoSegments = videoSegments
    this.mediaSource = null
    this.currentSegmentIndex = 0
  }

  init() {
    // 1º Check that browser has support for media codec
    if (!MediaSource.isTypeSupported(this.mimeCodec)) return

    // 2º Create Media Source
    this.mediaSource = new MediaSource()

    // 3º Attach media source to video element
    this.videoElement.src = URL.createObjectURL(this.mediaSource)

    // 5º Wait for media source to be open
    this.mediaSource.addEventListener(
      "sourceopen",
      this.onSourceOpen.bind(this)
    )
  }

  onSourceOpen() {
    const sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec)
    sourceBuffer.addEventListener("updateend", () =>
      this.onUpdateEnd(sourceBuffer)
    )
    sourceBuffer.addEventListener("error", (e) => this.onError(e))

    this.fetchSegment(
      this.videoSegments[this.currentSegmentIndex],
      sourceBuffer
    )
    this.currentSegmentIndex++
  }

  onUpdateEnd(sourceBuffer) {
    if (
      !sourceBuffer.updating &&
      this.currentSegmentIndex < this.videoSegments.length
    ) {
      this.fetchSegment(
        this.videoSegments[this.currentSegmentIndex],
        sourceBuffer
      )
      this.currentSegmentIndex++
    } else if (this.currentSegmentIndex >= this.videoSegments.length) {
      this.mediaSource.endOfStream()
    }
  }

  // Download segment and append to source buffer
  fetchSegment(url, sourceBuffer) {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        if (!sourceBuffer.updating) {
          sourceBuffer.appendBuffer(data)
        }
      })
      .catch((error) => console.error("Error fetching video segment:", error))
  }

  onError(e) {
    console.error("Source buffer error", e)
  }
}
