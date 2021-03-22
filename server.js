const app = require('express')()
const cors = require('cors')
const ytdl = require('ytdl-core')
const ffmpeg = require('ffmpeg')

app.use(cors())

app.get('/download', (req, res) => {
    let url = req.query.url
    // res.json({url})
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');

    let infoFormats = ''

    async function download() {
        let info = await ytdl.getInfo(url);
        infoFormats = info.formats.filter(video=>{
            if(video.qualityLabel && video.audioBitrate){
                return video
            }
        })
        if(infoFormats){
            ytdl(url, {
                quality: infoFormats[infoFormats.length - 1].itag,
                filter: format => format.container === 'mp4',
                format: 'mp4'
            }).pipe(res)
        }    
    }
    fuck()  
})

app.get('/download-audio', (req, res) => {
    let url = req.query.url
    // res.json({url})
    res.header('Content-Disposition', 'attachment; filename="audio.webm"');

    async function downloadAudio() {
        let info = await ytdl.getInfo(url);
        let audio = ytdl.filterFormats(info.formats, 'audioonly')[0]
        if(audio){
            console.log(audio);
            ytdl(url, {
                quality: audio.itag,
                filter: format => format.container === 'webm',
                format: 'webm'
            }).pipe(res)
        }    
    }
    downloadAudio()  
})

app.get('/download-video', (req, res) => {
    let url = req.query.url
    // res.json({url})
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');

    async function downloadVideo() {
        let info = await ytdl.getInfo(url);
        let video = ytdl.filterFormats(info.formats, 'videoonly').filter(video=>{
            if(video.container == "mp4" && video.itag < 140){
                return video
            }
        })[0]
        if(video){
            console.log(video);
            ytdl(url, {
                quality: video.itag,
                filter: format => format.container === 'mp4',
                format: 'mp4'
            }).pipe(res)
        }    
    }
    downloadVideo()  
})

app.listen(5000, () => {
    console.log('Сервер запущен');
})