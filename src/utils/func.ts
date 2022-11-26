import moment from 'moment';

export const newFormData = (payload: {[key: string]: any}) => {
  const _formData = new FormData();

  Object.keys(payload).forEach(key => {
    if (key.includes('photo')) {
      _formData.append(key, {
        uri: payload[key],
        type: 'image/jpg',
        name: 'checkin.jpg',
      });
    } else {
      _formData.append(key, payload[key]);
    }
  });

  return _formData;
};

export const format_HH_MM = date => {
  if (date)
    return moment(new Date(date * 1000))
      .format('HH:mm')
      .toString();
  return '';
};

export const format_DMY = date => {
  if (date)
    return moment(new Date(date * 1000))
      .format('YYYY-MM-DD')
      .toString();
  return '1970-01-01';
};
