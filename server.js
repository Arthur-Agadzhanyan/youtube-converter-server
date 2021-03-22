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

    async function fuck() {
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

app.listen(5000, () => {
    console.log('Сервер запущен');
})