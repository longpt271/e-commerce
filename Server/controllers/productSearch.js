const Product = require('../models/product');

const existCategory = [
  'iphone',
  'ipad',
  'macbook',
  'airpod',
  'watch',
  'mouse',
  'keyboard',
];

exports.getSearchProducts = async (req, res, next) => {
  // page query
  const currentPage = req.query.page || 1;
  const perPage = 8;

  const category = req.query.category || '';
  const name = req.query.name;

  // sort query
  const priceOrder = req.query.priceOrder;
  const nameOrder = req.query.nameOrder;
  let sortQuery = {};
  if (priceOrder) {
    sortQuery.price = priceOrder === 'desc' ? -1 : 1;
  }
  if (nameOrder) {
    sortQuery.name = nameOrder === 'desc' ? -1 : 1;
  }

  try {
    // Count tổng số items
    const totalItems = await Product.find({
      $and: [
        category && category !== 'other' ? { category: category } : {},
        category === 'other' ? { category: { $nin: existCategory } } : {}, // toán tử $nin (not in) để tìm tất cả các category mà không nằm trong danh sách [arr]
        { $or: [{ category: { $ne: '' } }, { category: { $exists: false } }] }, // toán tử tìm kiếm $ne để tìm tất cả các sản phẩm không có category là rỗng ('')
        name ? { name: { $regex: name, $options: 'i' } } : {},
      ],
    }).countDocuments();

    // Tìm tất cả Product thỏa mãn điều kiện kèm sort & page
    const products = await Product.find({
      $and: [
        category && category !== 'other' ? { category: category } : {},
        category === 'other' ? { category: { $nin: existCategory } } : {},
        { $or: [{ category: { $ne: '' } }, { category: { $exists: false } }] },
        name ? { name: { $regex: name, $options: 'i' } } : {},
      ],
    })
      .sort(sortQuery)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // trả về res
    res.status(200).json({
      message: 'Fetched products successfully.',
      products: products,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
