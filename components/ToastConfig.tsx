import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  achievement: ({ text1, text2, props }) => (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{props.icon || '🏆'}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{text1}</Text>
        <Text style={styles.description}>{text2}</Text>
      </View>
    </View>
  ),
  
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
    minHeight: 60,          // ✅ Changé de 'height: 60' à 'minHeight'
    maxHeight: 250,         // ✅ Limite maximale pour ne pas déborder
    width: '90%',
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    alignItems: 'flex-start', // ✅ Changé de 'center' à 'flex-start'
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 12,    // ✅ Ajout de padding vertical
  },
  iconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
    paddingVertical: 8,     // ✅ Ajout
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 4,     // ✅ Ajout pour l'espacement
    justifyContent: 'center',
  },
  title: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    flexWrap: 'wrap',       // ✅ Permet le retour à la ligne
  },
  description: {
    color: '#FFF',
    fontSize: 11,           // ✅ Réduit légèrement pour les longs textes
    lineHeight: 16,         // ✅ Espacement entre les lignes
    flexWrap: 'wrap',       // ✅ Permet le retour à la ligne
  }
});
