import { useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineMinus } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import carrinhoVazio from "../../assets/carrinhoVazio.png";
import { useCart } from "../../contexts/cartContext";
import { Container, DiscountBar, Modal } from "./styles";

interface ICartRipple {
  isOpenCart?: any;
  setisOpenCart?: any;
  onClick?: any;
}

const Cart = ({ setisOpenCart, onClick }: ICartRipple) => {
  const [isRipple, setIsRipple] = useState(false);
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const {
    cart,
    freightCart,
    addOneProduct,
    minusOneProduct,
    totalCart,
    subTotalCart,
  } = useCart();
  const priceToDiscount = 80 - totalCart;
  const hasDiscount = 80 - totalCart >= 0;
  const modalRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRipple(true);

      setTimeout(() => setIsRipple(false), 1000);
    } else {
      setIsRipple(false);
    }
  }, [coords]);

  useEffect(() => {
    if (!isRipple) setCoords({ x: -1, y: -1 });
  }, [isRipple]);

  useEffect(() => {
    function handleOutClick(event) {
      const value = modalRef?.current;

      if (value && !value.contains(event.target)) {
        setisOpenCart(false);
      }
    }
    document.addEventListener("mousedown", handleOutClick);

    return () => {
      document.removeEventListener("mousedown", handleOutClick);
    };
  }, []);

  const handleClick = (e) => {
    // if (totalCart > 0) {
    //   navigate("/checkout", { replace: true });
    //   setisOpenCart(false);
    // }

    setCoords({
      x: e.pageX - e.target.offsetLeft,
      y: e.pageY - e.target.offsetTop,
    });

    onClick && onClick(e);
  };

  const itemsCart = cart?.map((item, index, arr) => {
    let restaurantTitle = <></>;
    if (index === 0 || item.restaurant !== arr[index - 1].restaurant) {
      restaurantTitle = (
        <>
          {index === 0 ? <></> : <div className="divider"></div>}
          <h2>{item.restaurant}</h2>
          <Link to={`/restaurants/${item?.restaurantID}`} className="retornar">
            Retornar para a Loja
          </Link>
        </>
      );
    }
    return (
      <div key={item.id} className="cart-restaurantes">
        {restaurantTitle}
        <div className="card-item">
          <div className="item">
            <figure>
              <img src={item.photo_url} alt="" />
            </figure>
            <div className="info">
              <p>{item.item}</p>
              <strong>{`${item.price.toFixed(2)}`}</strong>
            </div>
            <div className="quantidade">
              <button onClick={() => minusOneProduct(item.id)}>
                {item.amount === 1 ? <FaTrashAlt /> : <AiOutlineMinus />}
              </button>
              <p>{item.amount}</p>
              <button onClick={() => addOneProduct(item.id)}>
                <MdAdd />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0 }}
      style={{ position: "absolute" }}
    >
      <Modal>
        <Container ref={modalRef}>
          <div className="header-cart">
            <button className="back-cart" onClick={() => setisOpenCart(false)}>
              <AiOutlineLeft />
            </button>
            <h3>Carrinho</h3>
          </div>
          <div className="container-itens">
            {totalCart === 0 ? (
              <div className="carrinho-vazio">
                <img src={carrinhoVazio} alt="carrinho vazio" />
                <h2>Carrinho vazio</h2>
                <p>
                  Adicione alguns produtos ao seu carrinho e volte aqui para
                  finalizar sua compra!
                </p>
              </div>
            ) : (
              <div className="desconto">
                {hasDiscount ? (
                  <div>
                    <p>
                      Gaste mais R$ {priceToDiscount.toFixed(2)} e ganhe
                      <strong> 10% de desconto</strong>
                    </p>
                    <DiscountBar width={100 - (priceToDiscount / 80) * 100}>
                      <div className="discount-variable"></div>
                    </DiscountBar>
                  </div>
                ) : (
                  <p>
                    Parabéns! Você ganhou <strong>10% de desconto</strong>
                  </p>
                )}
              </div>
            )}
            {totalCart != 0 && itemsCart}
          </div>

          <div className="rodape-cart">
            <div className="info-total">
              <div className="subtotal">
                <p>Subtotal</p>
                <p>{`R$ ${subTotalCart.toFixed(2)}`}</p>
              </div>

              <div className="frete">
                <p>Frete</p>
                <p>{`R$ ${freightCart.toFixed(2)}`}</p>
              </div>
              <div className="frete">
                <p>Desconto</p>
                <p>
                  R${" "}
                  {!hasDiscount
                    ? ((subTotalCart + freightCart) * 0.1).toFixed(2)
                    : 0}
                </p>
              </div>
            </div>
            <div className="finalizar-cart">
              <div className="total">
                <p>Total</p>
                <strong className="soma">{`R$ ${totalCart.toFixed(2)}`}</strong>
              </div>
              <button
                disabled={totalCart > 20 ? false : true}
                onClick={handleClick}
              >
                {isRipple ? (
                  <span
                    className="ripple"
                    style={{
                      left: coords.x + "px",
                      top: coords.y + "px",
                    }}
                  />
                ) : (
                  ""
                )}
                <span className="content">Finalizar Pedido</span>
              </button>
            </div>
          </div>
        </Container>
      </Modal>
    </motion.div>
  );
};

export default Cart;
