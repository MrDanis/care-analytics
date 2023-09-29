//
//  SceneDelegate.m
//  PatientEngagement
//
//  Created by Abdul Hannan on 07/07/2022.
//

#import <Foundation/Foundation.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>


@implementation SceneDelegate : NSObject

- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts
{
  UIOpenURLContext *context = URLContexts.allObjects.firstObject;
  [FBSDKApplicationDelegate.sharedInstance application:UIApplication.sharedApplication
                                               openURL:context.URL
                                     sourceApplication:context.options.sourceApplication
                                            annotation:context.options.annotation];
}
@end
