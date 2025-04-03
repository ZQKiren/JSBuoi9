// models/product.js
let mongoose = require('mongoose');
const slugify = require('slugify');

let productSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    description:{
        type: String,
        default: ""
    },
    quantity:{
        type: Number,
        default: 0,
        min: 0
    },
    imgURL:{
        type: String,
        default: ""
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

// Pre-save middleware to auto-generate slug from name
productSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

module.exports = mongoose.model('product', productSchema);
