import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import css from "./style.css";

class Products extends React.Component {

  constructor() {
    super();
    this.state = {
      productsList: [],
      products: [],
      jeans: "",
      sarees: "",
      tops: "",
      pants: "",
      tshirts: "",
      selectValue: "all",
      numberOfItems: 9,
      filter: true
    };
  }

  /**
   * Add scroll event listener after component mount
   * Get list of products from API
   */
  componentDidMount() {
    this.el = $(ReactDOM.findDOMNode(this));
    this.serverRequest = $.get("https://test-prod-api.herokuapp.com/products", (result) => {
      this.setState({
        productsList: result.products,
        products: result.products
      });
    });
    window.addEventListener("scroll", this.handleOnScroll);
  }

  /**
   * Remove scroll event listener before component unmount
   */
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleOnScroll);
  }

  /**
   * Handle scroll event to load more products
   */
  handleOnScroll = () => {
    var {products, numberOfItems} = this.state;
    var docEl = document.documentElement;
    var docBody = document.body;
    var scrollTop = (docEl && docEl.scrollTop) || docBody.scrollTop;
    var scrollHeight = (docEl && docEl.scrollHeight) || docBody.scrollHeight;
    var clientHeight = docEl.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop+clientHeight) >= scrollHeight;
    var nextItemCount = 9;
    if (scrolledToBottom) {
      if(numberOfItems < products.length) {
        this.setState({
          numberOfItems: numberOfItems + nextItemCount
        });
      }
    }
  }

  /**
   * Select filter property
   * @param  {object} e - selected target
   * @param  {string} field - selected filter name
   */
  handleChange = (e, field) => {
    let state = {};
    state[field] = e.target.checked ? field : "";
    this.setState(state, () => {
      this.filterProducts();
    });
  }

  /**
   * Select sorted property
   * @param  {object} e - selected target
   */
  handleSelect = (e) => {
     this.setState({
       selectValue:e.target.value
     }, () => {
       this.filterProducts();
     });
  }

  /**
   * Filter product list based on selection
   */
  filterProducts = () => {
    var {productsList, jeans, sarees, tops, pants, tshirts, selectValue} = this.state;
    var filterProducts = productsList.filter(value => {
      return value.cat == jeans ||
        value.cat == sarees ||
        value.cat == tops ||
        value.cat == pants ||
        value.cat == tshirts;
    });
    if(!filterProducts.length){
      filterProducts = productsList;
    }
    if(selectValue !== 'all') {
      filterProducts = this.sortTheProducts(filterProducts);
    }
    this.setState({
      products: filterProducts,
      numberOfItems: 9
    });
  }

  /**
   * Sort the product based on sort property selection
   * @param  {array} filterProducts - all product lists
   * @return {array}                - sorted array
   */
  sortTheProducts(filterProducts){
    var {selectValue} = this.state;
    var sortedProducts = [];
    if(selectValue === 'lth') {
      sortedProducts = filterProducts.sort((a, b) => {
        return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
      });
    } else if(selectValue === 'htl'){
      sortedProducts = filterProducts.sort((a, b) => {
        return (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0);
      });
    }
    return sortedProducts;
  }

  /**
   * Toggle filter menu when screen size is less than 700px
   */
  toggleFilter = () => {
    var {filter} = this.state;
    this.el.find("#productFilter").slideToggle( "slow" );
    this.setState({filter: !filter});
  }

  render() {
    var {products, numberOfItems, selectValue, filter} = this.state;
    var filterText = filter ? "Filter" : "X";
    // Iterate items and display item details
    var items = products.slice(0, numberOfItems).map(product => {
      return (
        <div className="product" key={product.id}>
          <div className="block">
            <div className="img-block" style={{backgroundImage: `url(${product.img})`}} />
            <div className="product-info">
              <div>{product.name}</div>
              <div>Rs {product.price}</div>
              <div>Category - {product.cat}</div>
              <div>Score - {product.score.toFixed(2)}</div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        {/* Header Section */}
        <div className="header">
          <div className="center head">
            Simple Shopping
          </div>
          <div className="toggle-filter"
            onClick={() => this.toggleFilter()}>{filterText}</div>
        </div>
        {/* Main Container */}
        <div className="container m-t-60">
          {/* Product filter menu */}
          <div className="product-filter" id="productFilter">
            <div className="head center">Filter</div>
            <ul>
              <li>
                <input type="checkbox"
                  name="jeans" value="jeans"
                  onChange={(e) => this.handleChange(e, "jeans")} />
                Jeans
              </li>
              <li>
                <input type="checkbox"
                  name="sarees" value="sarees"
                  onChange={(e) => this.handleChange(e, "sarees")} />
                Sarees</li>
              <li>
                <input type="checkbox"
                  name="tops" value="tops"
                  onChange={(e) => this.handleChange(e, "tops")} />
                Tops</li>
              <li>
                <input type="checkbox"
                  name="pants" value="pants"
                  onChange={(e) => this.handleChange(e, "pants")} />
                Pants</li>
              <li>
                <input type="checkbox"
                  name="tshirts" value="tshirts"
                  onChange={(e) => this.handleChange(e, "tshirts")} />
                T-Shirts</li>
            </ul>
            <div className="head center">Sort the Items</div>
            <ul>
              <li>
                <select value={selectValue} onChange={(e) => this.handleSelect(e)}>
                  <option value="all">All</option>
                  <option value="lth">Low to High</option>
                  <option value="htl">High to Low</option>
                </select>
              </li>
            </ul>
          </div>
          {/* Product List Details */}
          <div className="product-list">{items}</div>
        </div>
      </div>
    );
  }
}

export default Products;
