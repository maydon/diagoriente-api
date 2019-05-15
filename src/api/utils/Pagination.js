exports.pagination = async (list, query, model, querySearch) => {
  const count = await model.countDocuments(querySearch);
  const perPage = query.perPage ? query.perPage : 30;
  const formated = {
    count,
    perPage,
    currentPage: query.page ? query.page : 1,
    totalPages: Math.ceil(count / perPage),
    document: model.collection.name,
    data: list
  };
  return formated;
};
