import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  // On crée un type personnalisé 'achievement'
  achievement: ({ text1, text2, props }) => (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{props.icon || '🏆'}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.description}>{text2}</Text>
      </View>
    </View>
  ),
  
  // Tu peux garder les success/error par défaut ou les customiser aussi
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
    />
  )
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '90%',
    backgroundColor: '#1E1E1E', // Fond sombre
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700', // Bordure Or
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  title: {
    color: '#FFD700', // Or
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    color: '#FFF',
    fontSize: 12,
  }
});
