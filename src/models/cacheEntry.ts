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

const CacheEntry = mongoose.model<CacheEntryDoc, CacheEntryModel>('CacheEntry', cacheEntrySchema);

export {CacheEntry};