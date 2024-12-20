import { RequestServer } from "../../scenes/api/HttpReq";

export const fetchAutocompleteData = async (url, searchTerm, field) => {
    try {
      const response = await RequestServer("get",`${url}?projectname=${searchTerm}`);
        console.log(response, `response from FetchAutoCompleteData for ${field}`);
        const updatedData = response.data.map((item) => {
          return {
            label: item[field],
          };
        });
        console.log(updatedData, `updatedData from FetchAutoCompleteData for ${field}`);
        return updatedData;
    } catch (error) {
      console.error(`Error fetching autocomplete data for ${field}:`, error);
      return [];
    }
  };