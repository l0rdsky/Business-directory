import { View, Text } from 'react-native'
import React from 'react'
import Header from '@/components/Home/Header'
import Slider from '@/components/Home/Slider'
import PopularBusinessSection from '@/components/Home/PopularBusinessSection'
import Categories from '@/components/Home/Categories';
export default function home() {
  return (
    <View >
     {/* header */}
<Header/>
      {/* slider */}
<Slider/>
      {/* catagories  */}
<Categories></Categories>
<PopularBusinessSection></PopularBusinessSection>
    </View>
  )
}