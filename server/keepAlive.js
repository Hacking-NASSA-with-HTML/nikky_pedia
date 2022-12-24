let interval

export const keepAlive = (req, res) => {
    if (interval) return res.end()

    interval = setInterval(async () => {
        await fetch("https://render-back-end-nikky-pedia.onrender.com")
    }, 600000)

    return res.end()
}
