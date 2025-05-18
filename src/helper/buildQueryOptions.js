//Control Nested Search and filtering
const buildNestedCondition = (field, operator, value) => {
  const keys = field.split(".");
  const lastKey = keys.pop();

  let condition = {
    [lastKey]: {
      [operator]: value,
      ...(operator !== "equals" && { mode: "insensitive" }),
    },
  };

  // Nest the structure step-by-step
  return keys.reduceRight((acc, key) => ({ [key]: acc }), condition);
};

export const buildQueryOptions = (
  query = {},
  searchableFields = [],
  sortableFields = [],
  exactMatchFields = []
) => {
  const {
    searchTerm = "",
    filter = "",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const orderBy = sortableFields?.includes(sortBy)
    ? { [sortBy]: sortOrder.toLowerCase() === "asc" ? "asc" : "desc" }
    : {};

  //Exect Match search fields
  const exactMatchCondition =
    filter && exactMatchFields.length > 0
      ? exactMatchFields.map((field) =>
          buildNestedCondition(field, "equals", filter)
        )
      : [];

  // partial match on all searchable fields
  const partialMatchCondition =
    !filter && searchTerm && searchableFields.length > 0
      ? searchableFields.map((field) =>
          buildNestedCondition(field, "contains", searchTerm)
        )
      : [];

  const where = {
    ...(exactMatchCondition.length > 0 && { OR: exactMatchCondition }),
    ...(partialMatchCondition.length > 0 && { OR: partialMatchCondition }),
  };

  return { skip, take, orderBy, where };
};

//======Raw Query ======
// select: {
//   id: true,
//   classTitle: true,
//   classNo: true,
//   videoUrl: true,
//   thumbneil: true,
//   chapter: {
//     select: {
//       chapterName: true,
//       chapterImage: true,
//       subject: {
//         select: {
//           title: true,
//           subjectImage: true,
//         },
//       },
//       course: {
//         select: {
//           title: true,
//           courseImage: true,
//         },
//       },
//     },
//   },
// },
