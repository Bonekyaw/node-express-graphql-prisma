const asyncHandler = require("express-async-handler");

exports.offset = asyncHandler(
  async (
    model,
    page = 1,
    limit = 10,
    filters,
    order,
    relation
  ) => {
    const offset = (page - 1) * limit;

    let options = { skip: offset, take: limit };
    if (filters) {
      options.where = filters;
    }
    if (order) {
      options.orderBy = order;
    }
    if (relation) {
      options.include = relation;
    }

    let totalCount = {};
    if (filters) {
      totalCount = { where: filters };
    }

    const count = await model.count(totalCount);
    const results = await model.findMany(options);

    return {
      total: count,
      data: results,
      pageInfo: {
        currentPage: page,
        previousPage: page == 1 ? null : page - 1,
        nextPage: page * limit >= count ? null : page + 1,
        lastPage: Math.ceil(count / limit),
        countPerPage: limit,
      },
    };
  }
);

exports.noCount = asyncHandler(
  async (
    model,
    page = 1,
    limit = 10,
    filters,
    order,
    relation
  ) => {
    const offset = (page - 1) * limit;

    let options = { skip: offset, take: limit + 1 };
    if (filters) {
      options.where = filters;
    }
    if (order) {
      options.orderBy = order;
    }
    if (relation) {
      options.include = relation;
    }

    const results = await model.findMany(options);
    let hasNextPage = false;
    if (results.length > limit) {
      // if got an extra result
      hasNextPage = true; // has a next page of results
      results.pop(); // remove extra result
    }

    return {
      data: results,
      pageInfo: {
        currentPage: page,
        previousPage: page == 1 ? null : page - 1,
        nextPage: hasNextPage ? page + 1 : null,        
        countPerPage: limit,
      },
    };
  }
);

exports.cursor = asyncHandler(
  async (
    model,
    cursor,
    limit = 10,
    filters,
    order,
    relation
  ) => {
    let options = { take: limit };
    if (cursor) {
      options.skip = 1;
      options.cursor = { id: +cursor };
    }
    if (filters) {
      options.where = filters;
    }
    if (order) {
      options.orderBy = order;
    }
    if (relation) {
      options.include = relation;
    }

    const results = await model.findMany(options);
    const lastPostInResults = results.length ? results[results.length - 1] : []; // Remember: zero-based index! :)
    const myCursor = results.length ? lastPostInResults.id : null; 
    const hasNextPage = results.length ? results.length == limit : false;

    return {
      data: results.length ? results : [],
      pageInfo: {
        nextCursor: myCursor,
        hasNextPage,
      },
    };
  }
);