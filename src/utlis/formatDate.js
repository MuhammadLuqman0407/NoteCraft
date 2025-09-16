export const FormatDate = (date) => {
    // Handle null, undefined, or empty date
    if (!date) {
        return 'No Date';
    }

    const _date = new Date(date);
    if(isNaN(_date.getTime())){
        console.log('Invalid Date:', date);
        return 'Invalid Date';
    }

    const formattedDate = new Intl.DateTimeFormat('en-US',{
        year: 'numeric',
        month: 'long',
        day:'numeric',
    }).format(_date);
    return formattedDate;
};