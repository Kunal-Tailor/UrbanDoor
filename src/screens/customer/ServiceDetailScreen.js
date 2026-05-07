/**
 * ServiceDetailScreen.js — Full service details with provider info, reviews, and Book Now button
 */
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { PROVIDERS, REVIEWS } from '../../constants/mockData';
import StarRating from '../../components/StarRating';
import Button from '../../components/Button';
import { formatPrice } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const ServiceDetailScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const provider = PROVIDERS.find(p => p.id === service.providerId) || PROVIDERS[0];
  const reviews = REVIEWS.filter(r => r.serviceId === service.id);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View>
          <Image source={{ uri: service.image }} style={styles.heroImage} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title & Rating */}
          <Text style={styles.category}>{service.category}</Text>
          <Text style={styles.title}>{service.name}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={service.rating} size={16} showLabel />
            <Text style={styles.reviewCount}>({service.reviewCount} reviews)</Text>
          </View>

          {/* Price & Duration */}
          <View style={styles.priceRow}>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>{formatPrice(service.price)}</Text>
            </View>
            <View style={styles.durationCard}>
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.duration}>{service.duration}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About this service</Text>
          <Text style={styles.description}>{service.description}</Text>

          {/* What's included */}
          <Text style={styles.sectionTitle}>What's Included</Text>
          {service.includes.map((item, i) => (
            <View key={i} style={styles.includeItem}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.includeText}>{item}</Text>
            </View>
          ))}

          {/* Provider Info */}
          <Text style={styles.sectionTitle}>Service Provider</Text>
          <View style={styles.providerCard}>
            <Image source={{ uri: provider.profileImage }} style={styles.providerImage} />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerExp}>{provider.experience} experience</Text>
              <View style={styles.providerMeta}>
                <Ionicons name="star" size={13} color={COLORS.secondary} />
                <Text style={styles.providerRating}>{provider.rating}</Text>
                <Text style={styles.providerJobs}>• {provider.completedJobs} jobs done</Text>
              </View>
            </View>
          </View>

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.userImage }} style={styles.reviewAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <StarRating rating={review.rating} size={12} />
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>{formatPrice(service.price)}</Text>
          <Text style={styles.bottomPriceLabel}>onwards</Text>
        </View>
        <Button title="Book Now" icon="arrow-forward" iconPosition="right" style={styles.bookButton}
          onPress={() => navigation.navigate('Booking', { service, provider })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  heroImage: { width, height: 250 },
  backBtn: { position: 'absolute', top: 50, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  category: { fontSize: 12, fontWeight: '600', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginTop: 4, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  reviewCount: { fontSize: 13, color: COLORS.textTertiary, marginLeft: 6 },
  priceRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  priceCard: { flex: 1, backgroundColor: COLORS.primarySoft, borderRadius: 12, padding: 14 },
  priceLabel: { fontSize: 11, color: COLORS.textSecondary },
  price: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginTop: 2 },
  durationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.border },
  duration: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginLeft: 6 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12, marginTop: 8 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 20 },
  includeItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  includeText: { fontSize: 14, color: COLORS.textSecondary, marginLeft: 10, flex: 1 },
  providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  providerImage: { width: 52, height: 52, borderRadius: 16, marginRight: 12 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  providerExp: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  providerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  providerRating: { fontSize: 12, fontWeight: '600', marginLeft: 4, color: COLORS.textPrimary },
  providerJobs: { fontSize: 12, color: COLORS.textTertiary, marginLeft: 6 },
  reviewCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.divider },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  reviewName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  reviewDate: { fontSize: 11, color: COLORS.textTertiary },
  reviewComment: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  noReviews: { fontSize: 14, color: COLORS.textTertiary, fontStyle: 'italic' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 20, paddingVertical: 14, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.divider },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  bottomPriceLabel: { fontSize: 12, color: COLORS.textTertiary },
  bookButton: { paddingHorizontal: 32 },
});

export default ServiceDetailScreen;
