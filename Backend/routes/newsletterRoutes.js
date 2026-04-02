// import express from 'express';
// import Newsletter from '../models/Newsletter.js';

// const router = express.Router();

// // Export function to pass io instance
// const newsletterRoutes = (io) => {

//   // Public route - Subscribe to newsletter (no auth required)
//   router.post('/subscribe', async (req, res) => {
//     try {
//       const { email } = req.body;
      
//       if (!email) {
//         return res.status(400).json({
//           success: false,
//           message: 'Email is required'
//         });
//       }

//       // Check if already subscribed
//       const existingSubscription = await Newsletter.findOne({ 
//         email: email.toLowerCase().trim() 
//       });

//       if (existingSubscription) {
//         if (existingSubscription.status === 'subscribed') {
//           return res.status(409).json({
//             success: false,
//             message: 'Email already subscribed to newsletter'
//           });
//         } else {
//           // Reactivate subscription
//           existingSubscription.status = 'subscribed';
//           existingSubscription.subscribedAt = new Date();
//           existingSubscription.unsubscribedAt = undefined;
//           existingSubscription.isActive = true;
//           await existingSubscription.save();

//           console.log('Newsletter subscription reactivated:', existingSubscription.email);

//           // Emit real-time update
//           if (io) {
//             io.to('subscriptionRoom').emit('subscriptionUpdated', existingSubscription);
//             io.to('adminRoom').emit('subscriptionUpdated', existingSubscription);
//             console.log('Emitted subscription reactivated event');
//           }

//           return res.status(200).json({
//             success: true,
//             message: 'Successfully resubscribed to newsletter!',
//             data: existingSubscription
//           });
//         }
//       }

//       // Create new subscription
//       const newSubscription = await Newsletter.create({
//         email: email.toLowerCase().trim(),
//         status: 'subscribed',
//         ipAddress: req.ip,
//         userAgent: req.get('User-Agent'),
//         source: 'website'
//       });

//       console.log('New newsletter subscription:', newSubscription.email);

//       // Emit real-time update
//       if (io) {
//         io.to('subscriptionRoom').emit('newSubscription', newSubscription);
//         io.to('adminRoom').emit('newSubscription', newSubscription);
//         console.log('Emitted new subscription event');
//       }

//       res.status(201).json({
//         success: true,
//         message: 'Successfully subscribed to newsletter!',
//         data: newSubscription
//       });

//     } catch (error) {
//       console.error('Error subscribing to newsletter:', error);
      
//       if (error.code === 11000) {
//         return res.status(409).json({
//           success: false,
//           message: 'Email already subscribed to newsletter'
//         });
//       }

//       if (error.name === 'ValidationError') {
//         const validationErrors = Object.values(error.errors).map(err => err.message);
//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors: validationErrors
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: 'Failed to subscribe to newsletter',
//         error: error.message
//       });
//     }
//   });

//   // Public route - Unsubscribe from newsletter
//   router.post('/unsubscribe', async (req, res) => {
//     try {
//       const { email } = req.body;
      
//       if (!email) {
//         return res.status(400).json({
//           success: false,
//           message: 'Email is required'
//         });
//       }

//       const subscription = await Newsletter.findOne({ 
//         email: email.toLowerCase().trim() 
//       });

//       if (!subscription) {
//         return res.status(404).json({
//           success: false,
//           message: 'Email not found in our subscription list'
//         });
//       }

//       if (subscription.status === 'unsubscribed') {
//         return res.status(400).json({
//           success: false,
//           message: 'Email is already unsubscribed'
//         });
//       }

//       subscription.status = 'unsubscribed';
//       subscription.unsubscribedAt = new Date();
//       await subscription.save();

//       console.log('Newsletter unsubscription:', subscription.email);

//       // Emit real-time update
//       if (io) {
//         io.to('subscriptionRoom').emit('subscriptionUpdated', subscription);
//         io.to('adminRoom').emit('subscriptionUpdated', subscription);
//         console.log('Emitted subscription updated event');
//       }

//       res.json({
//         success: true,
//         message: 'Successfully unsubscribed from newsletter'
//       });

//     } catch (error) {
//       console.error('Error unsubscribing from newsletter:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to unsubscribe from newsletter',
//         error: error.message
//       });
//     }
//   });

//   // Admin routes - Get all subscriptions
//   router.get('/', async (req, res) => {
//     try {
//       const { status, page = 1, limit = 100 } = req.query;
//       let query = { isActive: true };

//       if (status) {
//         query.status = status;
//       }

//       const skip = (parseInt(page) - 1) * parseInt(limit);

//       const subscriptions = await Newsletter.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));

//       const total = await Newsletter.countDocuments(query);
//       const totalPages = Math.ceil(total / parseInt(limit));

//       console.log(`Retrieved ${subscriptions.length} newsletter subscriptions`);

//       res.json({
//         success: true,
//         data: subscriptions,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           totalPages,
//           hasNext: parseInt(page) < totalPages,
//           hasPrev: parseInt(page) > 1
//         }
//       });

//     } catch (error) {
//       console.error('Error fetching newsletter subscriptions:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch subscriptions',
//         error: error.message
//       });
//     }
//   });

//   // Admin route - Update subscription status
//   router.put('/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;

//       if (!['subscribed', 'unsubscribed', 'pending'].includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid status. Must be subscribed, unsubscribed, or pending'
//         });
//       }

//       const subscription = await Newsletter.findByIdAndUpdate(
//         id,
//         { status },
//         { new: true, runValidators: true }
//       );

//       if (!subscription) {
//         return res.status(404).json({
//           success: false,
//           message: 'Subscription not found'
//         });
//       }

//       console.log('Subscription status updated:', subscription.email, status);

//       // Emit real-time update
//       if (io) {
//         io.to('subscriptionRoom').emit('subscriptionUpdated', subscription);
//         io.to('adminRoom').emit('subscriptionUpdated', subscription);
//         console.log('Emitted subscription status update event');
//       }

//       res.json({
//         success: true,
//         message: 'Subscription status updated successfully',
//         data: subscription
//       });

//     } catch (error) {
//       console.error('Error updating subscription status:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update subscription status',
//         error: error.message
//       });
//     }
//   });

//   // Admin route - Delete subscription
//   router.delete('/:id', async (req, res) => {
//     try {
//       const { id } = req.params;

//       const subscription = await Newsletter.findByIdAndDelete(id);

//       if (!subscription) {
//         return res.status(404).json({
//           success: false,
//           message: 'Subscription not found'
//         });
//       }

//       console.log('Subscription deleted:', subscription.email);

//       // Emit real-time update
//       if (io) {
//         io.to('subscriptionRoom').emit('subscriptionDeleted', id);
//         io.to('adminRoom').emit('subscriptionDeleted', id);
//         console.log('Emitted subscription deleted event');
//       }

//       res.json({
//         success: true,
//         message: 'Subscription deleted successfully'
//       });

//     } catch (error) {
//       console.error('Error deleting subscription:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to delete subscription',
//         error: error.message
//       });
//     }
//   });

//   // Admin route - Get subscription stats
//   router.get('/stats', async (req, res) => {
//     try {
//       const [
//         total,
//         subscribed,
//         unsubscribed,
//         pending
//       ] = await Promise.all([
//         Newsletter.countDocuments({ isActive: true }),
//         Newsletter.countDocuments({ status: 'subscribed', isActive: true }),
//         Newsletter.countDocuments({ status: 'unsubscribed', isActive: true }),
//         Newsletter.countDocuments({ status: 'pending', isActive: true })
//       ]);

//       const stats = {
//         total,
//         subscribed,
//         unsubscribed,
//         pending,
//         subscriptionRate: total > 0 ? Math.round((subscribed / total) * 100) : 0
//       };

//       res.json({
//         success: true,
//         data: stats
//       });

//     } catch (error) {
//       console.error('Error fetching subscription stats:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch subscription stats',
//         error: error.message
//       });
//     }
//   });

//   return router;
// };

// export default newsletterRoutes;















import express from 'express';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

// Export function to pass io instance
const newsletterRoutes = (io) => {

  // Public route - Subscribe to newsletter (no auth required)
  router.post('/subscribe', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Enhanced email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Get additional client info for better tracking
      const ipAddress = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'Unknown';
      const referer = req.get('Referer') || 'Direct';

      // Check if already subscribed
      const existingSubscription = await Newsletter.findOne({ 
        email: email.toLowerCase().trim() 
      });

      if (existingSubscription) {
        if (existingSubscription.status === 'subscribed') {
          return res.status(409).json({
            success: false,
            message: 'You are already subscribed to our newsletter!'
          });
        } else {
          // Reactivate subscription
          existingSubscription.status = 'subscribed';
          existingSubscription.subscribedAt = new Date();
          existingSubscription.unsubscribedAt = undefined;
          existingSubscription.isActive = true;
          existingSubscription.ipAddress = ipAddress;
          existingSubscription.userAgent = userAgent;
          await existingSubscription.save();

          console.log(`✅ Newsletter subscription reactivated: ${existingSubscription.email}`);

          // Enhanced real-time update with more data
          if (io) {
            const updateData = {
              type: 'reactivated',
              subscription: existingSubscription,
              timestamp: new Date().toISOString(),
              totalSubscribed: await Newsletter.countDocuments({ status: 'subscribed', isActive: true })
            };

            io.to('subscriptionRoom').emit('subscriptionUpdated', updateData);
            io.to('adminRoom').emit('subscriptionUpdated', updateData);
            io.emit('newsletterStatsUpdate', {
              totalSubscribed: updateData.totalSubscribed
            });
            
            console.log('📡 Emitted subscription reactivated event to admin dashboard');
          }

          return res.status(200).json({
            success: true,
            message: 'Welcome back! You have been resubscribed to our newsletter.',
            data: {
              email: existingSubscription.email,
              status: existingSubscription.status,
              subscribedAt: existingSubscription.subscribedAt
            }
          });
        }
      }

      // Create new subscription
      const newSubscription = await Newsletter.create({
        email: email.toLowerCase().trim(),
        status: 'subscribed',
        ipAddress: ipAddress,
        userAgent: userAgent,
        source: 'website'
      });

      console.log(`🎉 New newsletter subscription: ${newSubscription.email} from IP: ${ipAddress}`);

      // Enhanced real-time update for new subscriptions
      if (io) {
        const totalSubscribed = await Newsletter.countDocuments({ status: 'subscribed', isActive: true });
        const totalSubscriptions = await Newsletter.countDocuments({ isActive: true });
        
        const newSubscriptionData = {
          type: 'new',
          subscription: newSubscription,
          timestamp: new Date().toISOString(),
          stats: {
            totalSubscribed,
            totalSubscriptions,
            subscriptionRate: totalSubscriptions > 0 ? Math.round((totalSubscribed / totalSubscriptions) * 100) : 0
          }
        };

        // Emit to specific admin rooms
        io.to('subscriptionRoom').emit('newSubscription', newSubscriptionData);
        io.to('adminRoom').emit('newSubscription', newSubscriptionData);
        io.to('dashboardRoom').emit('newSubscription', newSubscriptionData);
        
        // Also emit general stats update
        io.emit('newsletterStatsUpdate', newSubscriptionData.stats);
        
        console.log('📡 Emitted new subscription event to admin dashboard with updated stats');
      }

      res.status(201).json({
        success: true,
        message: 'Thank you for subscribing! You will receive our latest updates and news.',
        data: {
          email: newSubscription.email,
          status: newSubscription.status,
          subscribedAt: newSubscription.subscribedAt
        }
      });

    } catch (error) {
      console.error('❌ Newsletter subscription error:', error);
      
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      }

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Please check your email address format',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Unable to process subscription at this time. Please try again later.'
      });
    }
  });

  // Public route - Unsubscribe from newsletter
  router.post('/unsubscribe', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required for unsubscription'
        });
      }

      const subscription = await Newsletter.findOne({ 
        email: email.toLowerCase().trim() 
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Email address not found in our subscription list'
        });
      }

      if (subscription.status === 'unsubscribed') {
        return res.status(400).json({
          success: false,
          message: 'You are already unsubscribed from our newsletter'
        });
      }

      subscription.status = 'unsubscribed';
      subscription.unsubscribedAt = new Date();
      await subscription.save();

      console.log(`👋 Newsletter unsubscription: ${subscription.email}`);

      // Real-time update for unsubscription
      if (io) {
        const totalSubscribed = await Newsletter.countDocuments({ status: 'subscribed', isActive: true });
        
        const unsubscribeData = {
          type: 'unsubscribed',
          subscription: subscription,
          timestamp: new Date().toISOString(),
          totalSubscribed
        };

        io.to('subscriptionRoom').emit('subscriptionUpdated', unsubscribeData);
        io.to('adminRoom').emit('subscriptionUpdated', unsubscribeData);
        io.emit('newsletterStatsUpdate', { totalSubscribed });
        
        console.log('📡 Emitted unsubscription event to admin dashboard');
      }

      res.json({
        success: true,
        message: 'You have been successfully unsubscribed from our newsletter'
      });

    } catch (error) {
      console.error('❌ Newsletter unsubscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to process unsubscription. Please try again later.'
      });
    }
  });

  // Admin routes - Get all subscriptions with enhanced filtering
  router.get('/', async (req, res) => {
    try {
      const { status, page = 1, limit = 50, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      let query = { isActive: true };

      if (status) {
        query.status = status;
      }

      if (search) {
        query.email = { $regex: search, $options: 'i' };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [subscriptions, total] = await Promise.all([
        Newsletter.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        Newsletter.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / parseInt(limit));

      console.log(`📋 Retrieved ${subscriptions.length} newsletter subscriptions (page ${page})`);

      res.json({
        success: true,
        data: subscriptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('❌ Error fetching newsletter subscriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch newsletter subscriptions'
      });
    }
  });

  // Admin route - Update subscription status
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['subscribed', 'unsubscribed', 'pending'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be subscribed, unsubscribed, or pending'
        });
      }

      const subscription = await Newsletter.findByIdAndUpdate(
        id,
        { 
          status,
          ...(status === 'unsubscribed' ? { unsubscribedAt: new Date() } : { unsubscribedAt: undefined })
        },
        { new: true, runValidators: true }
      );

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }

      console.log(`🔄 Subscription status updated: ${subscription.email} -> ${status}`);

      // Real-time update with stats
      if (io) {
        const totalSubscribed = await Newsletter.countDocuments({ status: 'subscribed', isActive: true });
        
        const updateData = {
          type: 'admin_update',
          subscription: subscription,
          timestamp: new Date().toISOString(),
          totalSubscribed
        };

        io.to('subscriptionRoom').emit('subscriptionUpdated', updateData);
        io.to('adminRoom').emit('subscriptionUpdated', updateData);
        io.emit('newsletterStatsUpdate', { totalSubscribed });
        
        console.log('📡 Emitted admin subscription update event');
      }

      res.json({
        success: true,
        message: 'Subscription status updated successfully',
        data: subscription
      });

    } catch (error) {
      console.error('❌ Error updating subscription status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update subscription status'
      });
    }
  });

  // Admin route - Delete subscription
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const subscription = await Newsletter.findByIdAndDelete(id);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }

      console.log(`🗑️ Subscription deleted: ${subscription.email}`);

      // Real-time update
      if (io) {
        const totalSubscribed = await Newsletter.countDocuments({ status: 'subscribed', isActive: true });
        
        io.to('subscriptionRoom').emit('subscriptionDeleted', { id, totalSubscribed });
        io.to('adminRoom').emit('subscriptionDeleted', { id, totalSubscribed });
        io.emit('newsletterStatsUpdate', { totalSubscribed });
        
        console.log('📡 Emitted subscription deleted event');
      }

      res.json({
        success: true,
        message: 'Subscription deleted successfully'
      });

    } catch (error) {
      console.error('❌ Error deleting subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete subscription'
      });
    }
  });

  // Admin route - Get comprehensive subscription stats
  router.get('/stats', async (req, res) => {
    try {
      const [
        total,
        subscribed,
        unsubscribed,
        pending,
        todaySubscriptions,
        weekSubscriptions
      ] = await Promise.all([
        Newsletter.countDocuments({ isActive: true }),
        Newsletter.countDocuments({ status: 'subscribed', isActive: true }),
        Newsletter.countDocuments({ status: 'unsubscribed', isActive: true }),
        Newsletter.countDocuments({ status: 'pending', isActive: true }),
        Newsletter.countDocuments({ 
          isActive: true,
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }),
        Newsletter.countDocuments({ 
          isActive: true,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      ]);

      const stats = {
        total,
        subscribed,
        unsubscribed,
        pending,
        subscriptionRate: total > 0 ? Math.round((subscribed / total) * 100) : 0,
        todaySubscriptions,
        weekSubscriptions,
        activeSubscriptionRate: subscribed > 0 ? Math.round((subscribed / (subscribed + unsubscribed)) * 100) : 0
      };

      console.log('📊 Newsletter stats retrieved:', stats);

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('❌ Error fetching subscription stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscription statistics'
      });
    }
  });

  return router;
};

export default newsletterRoutes;