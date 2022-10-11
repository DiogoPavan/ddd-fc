export default class OrderItem {
    private _id: string;
    private _productId: string;
    private _name: string;
    private _unitPrice: number;
    private _price: number;
    private _quantity: number;

    constructor(
      id: string,
      name: string,
      unitPrice: number,
      productId: string,
      quantity: number
    ) {
      this._id = id;
      this._name = name;
      this._unitPrice = unitPrice;
      this._productId = productId;
      this._quantity = quantity;
    }

    get id(): string {
      return this._id;
    }

    get name(): string {
      return this._name;
    }

    get productId(): string {
      return this._productId;
    }

    get quantity(): number {
      return this._quantity;
    }

    get unitPrice(): number {
      return this._unitPrice;
    }

    get price(): number {
      return this._unitPrice * this._quantity;
    }
  }
