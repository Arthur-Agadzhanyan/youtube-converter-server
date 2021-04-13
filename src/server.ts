import express from 'express'
import cors from 'cors'
import ytdl from 'ytdl-core'

const app: express.Application = express()

app.use(cors())

app.get('/download', (req, res) => {
    let url: any = req.query.url
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');

    async function download() {
        let info = await ytdl.getInfo(url);
        let audioAndVideoFormats = info.formats.filter(video=>{
            if(video.qualityLabel && video.audioBitrate){
                return video
            }
        })
        if(audioAndVideoFormats){
            ytdl(url, {
                quality: audioAndVideoFormats[audioAndVideoFormats.length - 1].itag,
                filter: format => format.container === 'mp4'
            }).pipe(res)
        }    
    }
    download()  
})

app.get('/download-audio', (req, res) => {
    let url: any = req.query.url
    res.header('Content-Disposition', 'attachment; filename="audio.webm"');

    async function downloadAudio() {
        let info = await ytdl.getInfo(url);
        let audio = ytdl.filterFormats(info.formats, 'audioonly')[0]
        if(audio){
            ytdl(url, {
                quality: audio.itag,
                filter: format => format.container === 'webm'
            }).pipe(res)
        }    
    }
    downloadAudio()  
})

app.get('/download-video', (req, res) => {
    let url: any = req.query.url
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');

    async function downloadVideo() {
        let info = await ytdl.getInfo(url);
        let video = ytdl.filterFormats(info.formats, 'videoonly').filter(video=>{
            if(video.container == "mp4" && video.itag < 140){
                return video
            }
        })[0]
        if(video){
            ytdl(url, {
                quality: video.itag,
                filter: format => format.container === 'mp4'
            }).pipe(res)
        }    
    }
    downloadVideo()  
})

app.listen(5000 , () => {
    console.log('Сервер запущен');
})