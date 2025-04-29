"use client";

import { useState } from 'react';
import { useAwsCredentials } from '@/hooks/useAwsCredentials';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Loader2, Settings, Shield, Trash2, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';

// Define the configuration action types
interface AutoConfigAction {
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  error?: string;
}

export function AutoConfigButton() {
  const { selectedCredential, isLoading } = useAwsCredentials();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showRemoveStatus, setShowRemoveStatus] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configActions, setConfigActions] = useState<AutoConfigAction[]>([
    {
      name: 'Log Groups',
      description: 'Create CloudWatch log groups for security events',
      status: 'pending'
    },
    {
      name: 'CloudTrail',
      description: 'Configure CloudTrail to send logs to CloudWatch',
      status: 'pending'
    },
    {
      name: 'CloudWatch Logs Insights',
      description: 'Configure CloudWatch Logs Insights queries for security analysis',
      status: 'pending'
    }
  ]);
  const [removeActions, setRemoveActions] = useState<AutoConfigAction[]>([
    {
      name: 'CloudTrail',
      description: 'Remove CloudSIEM CloudTrail trail',
      status: 'pending'
    },
    {
      name: 'IAM Role',
      description: 'Remove CloudTrail role and policies',
      status: 'pending'
    },
    {
      name: 'CloudWatch Logs',
      description: 'Remove CloudWatch log groups',
      status: 'pending'
    }
  ]);
  const [configResult, setConfigResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [removeResult, setRemoveResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleOpenModal = () => {
    // Reset state when opening the modal
    setIsOpen(true);
    setIsConfiguring(false);
    setConfigResult(null);
    setShowConfirmation(false);
    setConfigActions(configActions.map(action => ({ ...action, status: 'pending', error: undefined })));
  };

  const handleShowConfirmation = () => {
    if (!selectedCredential) {
      toast.error('Please select an AWS credential first');
      return;
    }
    setShowConfirmation(true);
  };

  const handleShowRemoveConfirmation = () => {
    if (!selectedCredential) {
      toast.error('Please select an AWS credential first');
      return;
    }
    setShowRemoveConfirmation(true);
  };

  const handleAutoConfig = async () => {
    if (!selectedCredential) {
      toast.error('Please select an AWS credential first');
      return;
    }

    setShowConfirmation(false);
    setIsConfiguring(true);
    
    // Update all actions to in-progress
    setConfigActions(prev => 
      prev.map((action, index) => ({
        ...action,
        status: index === 0 ? 'in-progress' : 'pending'
      }))
    );

    try {
      const response = await fetch('/api/aws/siem/autoconfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to auto-configure SIEM environment');
      }

      // Update actions to completed
      setConfigActions(prev => prev.map(action => ({ ...action, status: 'completed' })));
      
      // Set success result
      setConfigResult({
        success: true,
        message: result.message || 'SIEM environment successfully configured',
        details: result.details
      });

      toast.success('SIEM environment successfully configured');
    } catch (error) {
      // Mark all actions as failed
      setConfigActions(prev => 
        prev.map(action => ({
          ...action,
          status: action.status === 'in-progress' ? 'failed' : action.status,
          error: action.status === 'in-progress' ? (error instanceof Error ? error.message : 'Failed') : undefined
        }))
      );
      
      // Set error result
      setConfigResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to auto-configure SIEM environment'
      });

      toast.error('Failed to auto-configure SIEM');
      console.error('Error auto-configuring SIEM:', error);
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleRemoveConfig = async () => {
    if (!selectedCredential) {
      toast.error('Please select an AWS credential first');
      return;
    }

    setShowRemoveConfirmation(false);
    setShowRemoveStatus(true);
    setIsRemoving(true);
    
    // Update all remove actions to in-progress
    setRemoveActions(prev => 
      prev.map((action, index) => ({
        ...action,
        status: index === 0 ? 'in-progress' : 'pending'
      }))
    );

    try {
      const response = await fetch('/api/aws/siem/autoconfig/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: selectedCredential.id
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove SIEM configuration');
      }

      // Update actions to completed
      setRemoveActions(prev => prev.map(action => ({ ...action, status: 'completed' })));
      
      // Set success result
      setRemoveResult({
        success: true,
        message: result.message || 'CloudSIEM configuration successfully removed',
        details: result.details
      });

      toast.success('CloudSIEM configuration successfully removed');
    } catch (error) {
      // Mark all actions as failed
      setRemoveActions(prev => 
        prev.map(action => ({
          ...action,
          status: action.status === 'in-progress' ? 'failed' : action.status,
          error: action.status === 'in-progress' ? (error instanceof Error ? error.message : 'Failed') : undefined
        }))
      );
      
      // Set error result
      setRemoveResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to remove SIEM configuration'
      });

      toast.error('Failed to remove SIEM configuration');
      console.error('Error removing SIEM configuration:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          onClick={handleOpenModal}
          className="flex gap-2 items-center"
          disabled={isLoading || !selectedCredential}
        >
          <Shield className="h-4 w-4" />
          Auto-Configure CloudSIEM
        </Button>

        <Button 
          onClick={handleShowRemoveConfirmation}
          variant="destructive"
          className="flex gap-2 items-center"
          disabled={isLoading || !selectedCredential || isRemoving}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {isRemoving ? 'Removing...' : 'Remove CloudSIEM Config'}
        </Button>
      </div>

      {/* Auto-Configure Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm CloudSIEM Configuration
            </DialogTitle>
            <DialogDescription>
              <p className="text-sm">
                This tool will configure your AWS environment with the necessary resources 
                to set up a Security Information and Event Management (SIEM) system using 
                CloudTrail, CloudWatch Logs, and CloudWatch Logs Insights.
              </p>
              <p className="text-sm">
                <strong>CloudWatch Logs Insights</strong> is used for powerful real-time security analysis, 
                providing advanced query capabilities for investigating security events, 
                identifying threats, and monitoring your AWS environment.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4 text-sm">
                <div className="flex gap-2 items-center font-medium mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Important
                </div>
                <p className="text-xs">
                  This will create resources in your AWS account that may incur charges. 
                  Make sure the credential has sufficient permissions to create and 
                  manage CloudTrail trails, CloudWatch Logs, and IAM roles.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                CloudWatch Log Groups
              </h3>
              <ul className="text-sm space-y-1 pl-6 list-disc">
                <li><code>/aws/siem/security-events</code> - For security-related events</li>
                <li><code>/aws/siem/network-activity</code> - For network traffic logs</li>
                <li><code>/aws/siem/authentication</code> - For authentication events</li>
                <li><code>/aws/siem/api-activity</code> - For API call monitoring</li>
                <li><code>/aws/cloudtrail/management-events</code> - For CloudTrail logs</li>
                <li>All log groups will have a 30-day retention policy</li>
              </ul>

              <h3 className="text-sm font-semibold flex items-center gap-2 mt-4">
                <Info className="h-4 w-4 text-blue-500" />
                CloudTrail Configuration
              </h3>
              <ul className="text-sm space-y-1 pl-6 list-disc">
                <li>A new CloudTrail trail will be created or an existing one updated</li>
                <li>IAM role <code>CloudTrailToCloudWatchLogsRole</code> will be created with required permissions</li>
                <li>CloudTrail will be configured to send logs to CloudWatch Logs</li>
                <li>Global service events will be included (IAM, S3, etc.)</li>
                <li>A subscription filter will forward logs to the SIEM group</li>
              </ul>

              <h3 className="text-sm font-semibold flex items-center gap-2 mt-4">
                <Info className="h-4 w-4 text-blue-500" />
                CloudWatch Logs Insights
              </h3>
              <ul className="text-sm space-y-1 pl-6 list-disc">
                <li>Configure CloudWatch Logs Insights queries for security analysis</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800 text-sm">
              <p className="font-medium">Important Notes:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>These changes will be made to your AWS account</li>
                <li>New resources will be created that may incur AWS charges</li>
                <li>Existing resources with the same names may be modified</li>
                <li>You can remove all configurations using the "Remove CloudSIEM Config" button</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAutoConfig}
              disabled={isConfiguring}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Proceed with Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Configuration Confirmation Dialog */}
      <Dialog open={showRemoveConfirmation} onOpenChange={setShowRemoveConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Remove CloudSIEM Configuration
            </DialogTitle>
            <DialogDescription>
              This will remove all CloudSIEM resources created by auto-configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">The following AWS resources will be removed:</h3>
              <ul className="text-sm space-y-1 pl-6 list-disc">
                <li>CloudTrail trail for SIEM monitoring</li>
                <li>CloudTrail IAM role and policy</li>
                <li>CloudWatch log groups and their contents</li>
                <li>Subscription filters between log groups</li>
              </ul>
            </div>

            <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>This action cannot be undone</li>
                <li>All collected logs will be permanently deleted</li>
                <li>You will need to reconfigure CloudSIEM if you want to restore functionality</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRemoveConfirmation(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRemoveConfig}
              disabled={isRemoving}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Confirm Removal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Status Dialog */}
      <Dialog open={showRemoveStatus} onOpenChange={setShowRemoveStatus}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove CloudSIEM Configuration</DialogTitle>
            <DialogDescription>
              Removing AWS resources created by CloudSIEM auto-configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {removeActions.map((action, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  {action.status === 'pending' && (
                    <div className="h-5 w-5 rounded-full border border-gray-300" />
                  )}
                  {action.status === 'in-progress' && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  )}
                  {action.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {action.status === 'failed' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{action.name}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                    {action.error && (
                      <div className="text-xs text-red-500 mt-1">{action.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {removeResult && (
              <div className={`mt-4 p-3 rounded-lg ${removeResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="flex items-center gap-2">
                  {removeResult.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">{removeResult.message}</span>
                </div>
                {removeResult.details && (
                  <div className="text-xs mt-2">
                    <div>• {removeResult.details.logGroups} Log groups removed</div>
                    <div>• CloudTrail: {removeResult.details.cloudTrail ? 'Removed' : 'Not found or not removed'}</div>
                    <div>• IAM Role: {removeResult.details.iamRole ? 'Removed' : 'Not found or not removed'}</div>
                    {removeResult.details.diagnostics && removeResult.details.diagnostics.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <details>
                          <summary className="cursor-pointer font-medium">Diagnostic Information</summary>
                          <div className="mt-2 max-h-40 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
                            {removeResult.details.diagnostics.map((message: string, idx: number) => (
                              <div key={idx} className="mb-1">{message}</div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                onClick={() => setShowRemoveStatus(false)}
                disabled={isRemoving}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Auto-Configure CloudSIEM</DialogTitle>
            <DialogDescription>
              This will set up the required CloudWatch resources and SIEM rules for monitoring.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {configActions.map((action, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  {action.status === 'pending' && (
                    <div className="h-5 w-5 rounded-full border border-gray-300" />
                  )}
                  {action.status === 'in-progress' && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  )}
                  {action.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {action.status === 'failed' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{action.name}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                    {action.error && (
                      <div className="text-xs text-red-500 mt-1">{action.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {configResult && (
              <div className={`mt-4 p-3 rounded-lg ${configResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="flex items-center gap-2">
                  {configResult.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">{configResult.message}</span>
                </div>
                {configResult.details && (
                  <div className="text-xs mt-2">
                    <div>• {configResult.details.logGroups} Log groups configured</div>
                    <div>• CloudTrail: {configResult.details.cloudTrail || "Not configured"}</div>
                    <div>• CloudWatch Logs Insights Queries: {configResult.details.insightsQueries || 0} configured</div>
                    
                    {configResult.details.insightsQueriesList && configResult.details.insightsQueriesList.length > 0 && (
                      <div className="mt-2">
                        <div className="font-medium">Configured Insights Queries:</div>
                        <ul className="text-xs pl-4 list-disc">
                          {configResult.details.insightsQueriesList.map((query: any, index: number) => (
                            <li key={index}>{query.name} - {query.description}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>• IAM Role: {configResult.details.iamRole ? 'Created' : 'Not created or already existed'}</div>
                    {configResult.details.diagnostics && configResult.details.diagnostics.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <details>
                          <summary className="cursor-pointer font-medium">Diagnostic Information</summary>
                          <div className="mt-2 max-h-40 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
                            {configResult.details.diagnostics.map((message: string, idx: number) => (
                              <div key={idx} className="mb-1">{message}</div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                onClick={() => setIsOpen(false)}
                disabled={isConfiguring}
              >
                Close
              </Button>
              {!configResult && (
                <Button 
                  onClick={handleShowConfirmation}
                  disabled={isConfiguring || !selectedCredential}
                  className="gap-2"
                >
                  {isConfiguring ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Configuring...
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4" />
                      Start Configuration
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 