export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        if (this.queryString.page <= 0) page = 1;
        const skip = (page - 1) * 5

        this.mongooseQuery.skip(skip).limit(5);

        return this;
    }

    //2-filtering
    filter() {
        let filterObj = { ...this.queryString }
        const excludeQuery = ['page', 'keyword', 'sort', 'fields']
        excludeQuery.forEach((q) => {
            delete filterObj[q]
        })

        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/\b(gt|gte|lt|lte|lt)\b/g, match => `$${match}`)
        filterObj = JSON.parse(filterObj)
        this.mongooseQuery.find(filterObj)
        return this;

    }
    // 3- sort
    sort() {
        if (this.queryString.sort) {
            const sortedBy = this.queryString.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
        }
        return this
    }
    //4- search
    search() {
        if (this.queryString.keyword) {
            this.mongooseQuery.find(
                {
                    $or: [
                        { title: { $regex: this.queryString.keyword, $options: 'i' } },
                        { description: { $regex: this.queryString.keyword, $options: 'i' } }

                    ]
                }
            )
        }
        return this
    }


    //5-fields 
    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.mongooseQuery.select(fields)
        }
        return this
    }
}