import { useState } from "react";
import ItemCard from "./ItemCard";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Pagination, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoAccessCard from "../../../scenes/NoAccess/NoAccessCard";


// Common RelatedSection component for rendering a section of related items
const RelatedSection = ({
    title,
    items,
    permissions,
    displayFields,
    onAdd,
    onEdit,
    onDelete,
    itemsPerPage = 2
}) => {
    const [page, setPage] = useState(1);
    const noOfPages = Math.ceil(items.length / itemsPerPage);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4">{title} ({items.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {permissions.read ? (
                    <>
                        {permissions.create && (
                            <div style={{ textAlign: "end", marginBottom: "5px" }}>
                                <Button variant="contained" color="info" onClick={onAdd}>
                                    Add {title}
                                </Button>
                            </div>
                        )}
                        <Card>
                            {items
                                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                .map((item) => (
                                    <ItemCard
                                        key={item._id}
                                        item={item}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        permissions={permissions}
                                        displayFields={displayFields}
                                    />
                                ))}
                        </Card>
                        {items.length > 0 && (
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Pagination
                                    count={noOfPages}
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    defaultPage={1}
                                    color="primary"
                                    size="medium"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <NoAccessCard />
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default RelatedSection;