import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Fonts } from '../constants/fonts';

const FontTestComponent = () => {
  const fontStyles = [
    { name: 'Thin', font: Fonts.Poppins.Thin },
    { name: 'ExtraLight', font: Fonts.Poppins.ExtraLight },
    { name: 'Light', font: Fonts.Poppins.Light },
    { name: 'Regular', font: Fonts.Poppins.Regular },
    { name: 'Medium', font: Fonts.Poppins.Medium },
    { name: 'SemiBold', font: Fonts.Poppins.SemiBold },
    { name: 'Bold', font: Fonts.Poppins.Bold },
    { name: 'ExtraBold', font: Fonts.Poppins.ExtraBold },
    { name: 'Black', font: Fonts.Poppins.Black },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { fontFamily: Fonts.Poppins.Bold }]}>
        🎨 Poppins Font Test
      </Text>
      
      {fontStyles.map((style, index) => (
        <View key={index} style={styles.fontRow}>
          <Text style={[styles.fontName, { fontFamily: Fonts.Poppins.Medium }]}>
            {style.name}:
          </Text>
          <Text style={[styles.fontText, { fontFamily: style.font }]}>
            The quick brown fox jumps over the lazy dog
          </Text>
        </View>
      ))}
      
      <Text style={[styles.subtitle, { fontFamily: Fonts.Poppins.Medium }]}>
        📱 This text should display with Poppins fonts in your native Android app!
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
  fontRow: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fontName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  fontText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
  },
});

export default FontTestComponent; 