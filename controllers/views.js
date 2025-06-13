const partialRender = (req, res) => {
    const {folder, view} = req.params;
    res.render(`${folder}/${view}`);
}

const home = (req, res) => {
    res.render('index');
}

module.exports = { 
    partialRender,
    home
}