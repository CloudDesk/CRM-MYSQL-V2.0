import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography } from '@mui/material';

const DynamicChart = ({
    data,
    chartType = 'bar',
    title = '',
    xAxisTitle = '',
    yAxisTitle = 'Count',
    groupByField1 = '',
    groupByField2 = ''
}) => {
    // Ensure data is valid
    if (!data || !data.series || !data.options) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                    No chart data available
                </Typography>
            </Box>
        );
    }

    // Prepare chart options with sensible defaults
    const chartOptions = {
        ...data.options,
        chart: {
            ...data.options.chart,
            type: chartType.toLowerCase(),
            height: 350,
            stacked: chartType.toLowerCase() === 'bar',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        plotOptions: {
            ...data.options.plotOptions,
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        xaxis: {
            ...data.options.xaxis,
            title: {
                text: xAxisTitle || data.options.xaxis?.title?.text || groupByField2.charAt(0).toUpperCase() + groupByField2.slice(1)
            }
        },
        yaxis: {
            ...data.options.yaxis,
            title: {
                text: yAxisTitle
            }
        },
        title: {
            ...data.options.title,
            text: title || data.options.title?.text,
            align: 'center'
        },
        legend: {
            ...data.options.legend,
            position: 'right',
            title: {
                text: groupByField1.charAt(0).toUpperCase() + groupByField1.slice(1)
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            opacity: 0.8
        }
    };

    return (
        <Box sx={{
            mt: 4,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1
        }}>
            <ReactApexChart
                options={chartOptions}
                series={chartType.toLowerCase() === 'pie' ? data.series : data.series}
                type={chartType.toLowerCase()}
                height={350}
                width="100%"
            />
        </Box>
    );
};

export default DynamicChart;