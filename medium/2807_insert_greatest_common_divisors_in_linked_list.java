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
    public int findGcd(int a,int b){
           while(a!=b){
               if(a>b)
               a-=b;
               else
               b=b-a;
           } 
           return a;   
            
        }
    public ListNode insertGreatestCommonDivisors(ListNode head) {
        ListNode prevNode=null;
        ListNode currentNode=head;
      if(head.next==null){
          return head;
      }
      while(currentNode.next!=null){
          prevNode=currentNode;
          currentNode=currentNode.next;
          ListNode temp=new ListNode(findGcd(prevNode.val,currentNode.val));
          temp.next=prevNode.next;
          prevNode.next=temp;
      }
      return head;
       
    }
}