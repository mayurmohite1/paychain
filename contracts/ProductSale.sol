// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductSale {
    // Product struct to store product details
    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price; // Price in ETH (wei)
        uint256 quantity;
        address seller;
        bool active;
    }

    // Mapping to store products
    mapping(uint256 => Product) public products;
    uint256 public productCount;

    // Events
    event ProductListed(uint256 indexed id, string name, uint256 price, uint256 quantity);
    event ProductSold(uint256 indexed id, address buyer, uint256 quantity, uint256 totalPrice);
    event ProductUpdated(uint256 indexed id, uint256 newQuantity, uint256 newPrice);

    // Modifiers
    modifier onlyProductOwner(uint256 _productId) {
        require(products[_productId].seller == msg.sender, "Not the product owner");
        _;
    }

    modifier productExists(uint256 _productId) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        require(products[_productId].active, "Product is not active");
        _;
    }

    // Add a new product
    function listProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity
    ) external returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        require(_quantity > 0, "Quantity must be greater than 0");

        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            description: _description,
            price: _price,
            quantity: _quantity,
            seller: msg.sender,
            active: true
        });

        emit ProductListed(productCount, _name, _price, _quantity);
        return productCount;
    }

    // Purchase products
    function purchaseProduct(uint256 _productId, uint256 _quantity) 
        external 
        payable
        productExists(_productId) 
    {
        Product storage product = products[_productId];
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_quantity <= product.quantity, "Not enough quantity available");
        require(msg.value >= product.price * _quantity, "Insufficient payment");

        // Update product quantity
        product.quantity -= _quantity;

        // Transfer payment to seller
        payable(product.seller).transfer(msg.value);

        emit ProductSold(_productId, msg.sender, _quantity, msg.value);

        // If quantity becomes 0, mark product as inactive
        if (product.quantity == 0) {
            product.active = false;
        }
    }

    // Update product details
    function updateProduct(
        uint256 _productId,
        uint256 _newPrice,
        uint256 _newQuantity
    ) external onlyProductOwner(_productId) productExists(_productId) {
        require(_newPrice > 0, "Price must be greater than 0");
        
        Product storage product = products[_productId];
        product.price = _newPrice;
        
        if (_newQuantity > 0) {
            product.quantity = _newQuantity;
        }

        emit ProductUpdated(_productId, product.quantity, product.price);
    }

    // Get product details
    function getProduct(uint256 _productId) 
        external 
        view 
        productExists(_productId) 
        returns (
            string memory name,
            string memory description,
            uint256 price,
            uint256 quantity,
            address seller,
            bool active
        ) 
    {
        Product memory product = products[_productId];
        return (
            product.name,
            product.description,
            product.price,
            product.quantity,
            product.seller,
            product.active
        );
    }

    // Get total number of active products
    function getActiveProductCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].active) {
                count++;
            }
        }
    }
}