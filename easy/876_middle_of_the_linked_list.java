/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode nodeList=head;
        int count=0;
        int count2=0;
        int  n=0;
        while(head.next!=null){
            count++;
            head=head.next;
        }
        if(count%2==0){
            n=count/2;
        }
        else{
            n=(count+1)/2;
        }
        while(count2<n){
            nodeList=nodeList.next;
            count2++;
        }
        return nodeList;
    }
}