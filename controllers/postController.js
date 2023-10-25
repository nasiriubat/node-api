const Post = require('../models/post');


exports.getAll = async(req, res) => {
    try {
        const data = await Post.find();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.store = async(req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'title and description are required fields.' });
    }
    const data = new Post({
        title,
        description
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.show = async(req, res) => {
    try {
        const data = await Post.findById(req.params.id);
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.update = async(req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Post.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.delete = async(req, res) => {
    try {
        const id = req.params.id;
        const data = await Post.findByIdAndDelete(id)
        res.send(`Document with ${data.title} has been deleted.`)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}