export const ExcelJS = {
    Workbook: require('./doc/workbook'),
    ModelContainer: require('./doc/modelcontainer'),
    stream: {
        xlsx: {
            WorkbookWriter: require('./stream/xlsx/workbook-writer'),
            WorkbookReader: require('./stream/xlsx/workbook-reader'),
        },
    },
    ...require('./doc/enums'),
};

