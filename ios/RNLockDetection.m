#import "RNLockDetection.h"

RNLockDetection * refToSelf;

static void displayStatusChanged(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef userInfo)
{
    NSString *lockState = (__bridge NSString*)name;

    if([lockState isEqualToString:@"com.apple.springboard.lockcomplete"])
    {
        [refToSelf lockStatusChanged:@"LOCKED"];
    }
    else
    {
        [refToSelf lockStatusChanged:@"NOT_LOCKED"];
    }
}


@implementation RNLockDetection

- (id) init
{
    self = [super init];
    refToSelf = self;
    return self;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_MODULE(RNLockDetection);

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"LockStatusChange"];
}

- (void)lockStatusChanged:(NSString *)newStatus
{
  NSString *newLockedStatus = newStatus;
  [self sendEventWithName:@"LockStatusChange" body:@{@"status": newLockedStatus}];
}

RCT_EXPORT_METHOD(registerDeviceLockListener) {
    CFNotificationCenterAddObserver(CFNotificationCenterGetDarwinNotifyCenter(), NULL, displayStatusChanged, CFSTR("com.apple.springboard.lockcomplete"), NULL,CFNotificationSuspensionBehaviorDeliverImmediately);

    CFNotificationCenterAddObserver(CFNotificationCenterGetDarwinNotifyCenter(), NULL, displayStatusChanged, CFSTR("com.apple.springboard.lockstate"), NULL, CFNotificationSuspensionBehaviorDeliverImmediately);
}

@end
