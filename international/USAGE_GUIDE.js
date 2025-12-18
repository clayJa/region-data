
// =============== 使用说明 ===============
// 1. 在组件中引入:
import { useState, useCallback } from 'react';
import { Picker, Cell } from '@nutui/nutui-react-taro';

// 2. 组件代码:
const InternationalAddressPicker = ({ onConfirm }) => {
  const [visible, setVisible] = useState(false);
  const [columns, setColumns] = useState([[], []]); // 国家, 城市
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([0, 0]);

  // 简单缓存
  const cache = {
    countries: null,
    cities: {}
  };

  // 加载国家
  const loadCountries = async () => {
    if (cache.countries) {
      setColumns([cache.countries, []]);
      return;
    }

    setLoading(true);
    try {
      const res = await Taro.request({ url: '/international/countries.json' });
      const countries = res.data.map(item => ({
        text: item.text,
        value: item.id
      }));

      cache.countries = countries;
      setColumns([countries, []]);
    } finally {
      setLoading(false);
    }
  };

  // 加载城市
  const loadCities = async (countryId) => {
    if (cache.cities[countryId]) {
      setColumns(prev => [prev[0], cache.cities[countryId]]);
      return;
    }

    setLoading(true);
    try {
      const res = await Taro.request({
        url: `/international/cities_${countryId}.json`
      });

      const cities = res.data.map(item => ({
        text: item.text,
        value: item.id,
        zone: item.zone,
        lng: item.lng,
        iana: item.iana
      }));

      cache.cities[countryId] = cities;
      setColumns(prev => [prev[0], cities]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  const initPicker = () => {
    setVisible(true);
    if (!cache.countries) loadCountries();
  };

  // 列变化处理
  const handleChange = async (picker, value, options) => {
    setSelected(value);

    // 国家变化时加载对应城市
    if (value[0] !== selected[0] && columns[0].length > 0) {
      const countryId = columns[0][value[0]].value;
      await loadCities(countryId);
      setSelected([value[0], 0]); // 重置城市选择
    }
  };

  // 确认选择
  const handleConfirm = () => {
    const [countryIndex, cityIndex] = selected;
    const country = columns[0][countryIndex];
    const city = columns[1][cityIndex];

    if (country && city) {
      onConfirm({
        country: { id: country.value, name: country.text },
        city: {
          id: city.value,
          name: city.text,
          zone: city.zone,
          lng: city.lng,
          iana: city.iana
        },
        fullAddress: `${country.text} ${city.text}`
      });
    }
    setVisible(false);
  };

  return (
    <div>
      <Cell title="国际地址" onClick={initPicker} />
      <Picker
        visible={visible}
        columns={columns}
        value={selected}
        title="选择地址"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
        onChange={handleChange}
      />
    </div>
  );
};

export default InternationalAddressPicker;
