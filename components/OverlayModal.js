import React from 'react'
import PropTypes from "prop-types";
import {
  StyleSheet, View, Modal, TouchableOpacity, SafeAreaView
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const styles = StyleSheet.create({
  ghostContainer: {
    flexGrow: 1,
    backgroundColor:"rgba(0, 0, 0 , 0.3)"
  },
  modalContainer: {
    flex: 1
  },
  btnClose: {
    alignItems: 'flex-end',
    padding: 10
  },
  wrapperModal: {
    flexGrow: 2,
    backgroundColor:"white"
  }
})

const OverlayModal = ({ children, isActive, closeModal }) => (
    <Modal
        transparent
        animationType="slide"
        visible={isActive}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.wrapperModal}>
            <TouchableOpacity onPress={closeModal} style={styles.btnClose}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            {children}
          </View>
          <View style={styles.ghostContainer} />
        </View>
      </SafeAreaView>
    </Modal>
)
OverlayModal.propTypes = {
  children: PropTypes.element.isRequired,
  isActive:PropTypes.bool.isRequired,
  closeModal:PropTypes.func.isRequired,
};
export default OverlayModal
