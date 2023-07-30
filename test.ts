import ffmpeg from 'fluent-ffmpeg'

ffmpeg(
  'C:\\Users\\chenyitao\\dev\\playground\\video-player\\src\\renderer\\public\\av1.mkv',
)
  .thumbnail({
    filename: 'xxx.png',
    count: 1,
    timestamps: ['50%'],
    folder:
      'C:\\Users\\chenyitao\\dev\\playground\\video-player\\src\\renderer\\public',
  })
  .once('error', (error) => {
    console.log('error ==========>', error)
  })
  .once('end', (result) => {
    console.log('result ==========>', result)
  })
// .output(
//   'C:\\Users\\chenyitao\\dev\\playground\\video-player\\src\\renderer\\public',
// )
// .run()
