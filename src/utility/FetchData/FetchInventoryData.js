import { RequestServer } from "../../scenes/api/HttpReq";

const GET_INVENTORY_DATA_URL = "/inventories";

export const FetchInventoryData = async () => {
    try {
        const response  = await RequestServer("get", GET_INVENTORY_DATA_URL);
        console.log(response, "response from FetchInventoryData");
        const updatedData = response.data.map((item) => {
            return {
               label: item.projectname,
            };
        }
        );
        console.log(updatedData, "updatedData from FetchInventoryData");
        return updatedData;
    } catch (error) {
        console.error(error);
    }
}

