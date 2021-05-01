import mongoose from 'mongoose';

interface CacheEntryAttrs {
    cacheKey: string;
    cacheData: string;
}

interface CacheEntryDoc extends mongoose.Document {
    cacheKey: string;
    cacheData: string;
}

interface CacheEntryModel extends mongoose.Model<CacheEntryDoc> {
    build(attrs: CacheEntryAttrs): CacheEntryDoc;
    cacheMiss(): void,
    cacheHit(): void
}

const cacheEntrySchema = new mongoose.Schema<CacheEntryDoc, CacheEntryModel>(
    {
        cacheKey: {
            type: String,
            required: true,
        },
        cacheData: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

cacheEntrySchema.statics.build = (attrs: CacheEntryAttrs) => {
    return new CacheEntry(attrs);
};

cacheEntrySchema.statics.cacheMiss = () => {
    return console.log('Cache miss');
};

cacheEntrySchema.statics.cacheHit = () => {
    return console.log('Cache hit');
};

cacheEntrySchema.statics.isFull = async () => {
    let entryLimit = 10;
    let cacheEntries = await CacheEntry.find();
    console.log(cacheEntries.length);
    console.log(entryLimit);
    return (cacheEntries.length >= entryLimit);
}

cacheEntrySchema.pre('save', function(next) {
    const CACHE_ENTRY_LIMIT = 10;

    CacheEntry.find((err, res) => {
        if (res.length >= CACHE_ENTRY_LIMIT){
            CacheEntry.find({}).sort({createdAt: 1}).exec(async (err, cacheEntries) => {
                console.log(`Cache is full, recycling an oldest entry with the cacheKey: ${cacheEntries[0].cacheKey}`);
                const cacheKey = cacheEntries[0].cacheKey;
                await CacheEntry.deleteOne({cacheKey: cacheKey});
                next();
            });
        }
        next();
    });

});

const CacheEntry = mongoose.model<CacheEntryDoc, CacheEntryModel>('CacheEntry', cacheEntrySchema);

export {CacheEntry};