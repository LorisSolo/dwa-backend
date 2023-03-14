const mongoose  = require("mongoose");

const ReceptiSchema = new mongoose.Schema({
    title:{
        type: mongoose.SchemaTypes.String,
        require:true
    },
    ingredients:{
        type: [mongoose.SchemaTypes.String],
        require:true
    },
    description:{
        type: mongoose.SchemaTypes.String,
        require: true
    },
    })

module.exports = mongoose.model('recepti', ReceptiSchema)