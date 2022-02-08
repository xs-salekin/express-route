
const callback = {
    home: (req,res)=>{
        res.send('This is home page')
    },
    user: (req, res) => {

        res.send({ msg: 'This user is valid', data: req.body })
    }
}

export { callback }
