import { useRestaurantProductsContext } from "../../contexts/restaurantProductsContext";
import { MenuRestaurant } from "../menu-restaurant";
import { Container, ContainerHeader } from "./styles";

export const RestaurantInfo = () => {
  const { restaurantInfo } = useRestaurantProductsContext();

  return (
    <Container>
      <ContainerHeader>
        <div>
          <h3>{restaurantInfo.name}</h3>
          <p>Horário de funcionamento: {restaurantInfo["opening-hours"]}</p>
        </div>
        <figure>
          <img src={restaurantInfo["logo-image"]} alt={restaurantInfo.name} />
        </figure>
      </ContainerHeader>
      {!!restaurantInfo && <MenuRestaurant />}
    </Container>
  );
};
